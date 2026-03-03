import crypto from 'crypto';

import {
  TrackRequestPayload,
  AlertResult,
  BudgetEvaluationResult,
  AlertType,
  BUDGET_WARNING_PERCENT,
  BUDGET_CRITICAL_PERCENT,
} from '@costshield/shared';

import { sequelize } from '../../database';
import { Project, CostEvent, DailyCost, BudgetAlert } from '../../models';

export interface TrackServiceResult {
  budgetStatus: BudgetEvaluationResult;
  alertToTrigger: AlertResult | null;
  projectInfo: {
    userId: string;
    name: string;
    currencyCode: string;
  } | null;
}

export const trackingService = {
  /**
   * Core logic for tracking costs.
   * Runs the entire state mutation inside a single Sequelize Transaction.
   * Does NOT send emails. Returns the alert that needs to be sent if any.
   */
  async trackCost(payload: TrackRequestPayload): Promise<TrackServiceResult> {
    // Determine today's date in YYYY-MM-DD format (UTC based normally or application specific)
    const today = new Date().toISOString().split('T')[0];

    return await sequelize.transaction(async (t) => {
      // 1. Validate API key and get Project (Locking the project row isn't strictly necessary if budget tracking depends on aggregations or idempotent daily inserts)
      // Usually api key is passed as prefix_hash. In tracking, payload.apiKey is just the raw key or combined?
      // Assumption: payload.apiKey is the exact string passed by SDK that we need to hash or match.
      // But the PRD says 'api_key_hash'. So we might need to hash it.
      // For now, let's assume we search by `apiKeyHash` or we'd just find it if the prefix matches.
      // Given v1 might not have the full hashing logic implemented in SDK/API shared, let's assume `apiKey` in payload IS the `keyPrefix` for lookup, or we need to extract prefix.
      // Let's extract prefix: e.g. "cs_live_1234abcd" -> "cs_live_"... wait, prefix is "cs_live_1234" etc.
      // Actually, standard is finding the project by apiKey. We will simulate a simple lookup for now.

      // We need to parse prefix (say first 12 chars). Easiest way is if payload.apiKey is passed.
      const prefix = payload.apiKey.substring(0, 16); // Assuming prefix length

      const project = await Project.findOne({
        where: { keyPrefix: prefix },
        transaction: t,
        lock: t.LOCK.SHARE, // prevent concurrent deletes
      });

      if (!project) {
        throw new Error('Project not found or invalid API key');
      }

      // Hash incoming exact key and compare natively inside service
      // This protects us from prefix collisions entirely.
      const hash = crypto.createHash('sha256').update(payload.apiKey).digest('hex');
      if (project.apiKeyHash !== hash) {
        throw new Error('Project not found or invalid API key');
      }

      // Validate cost is integer. We never round.
      if (!Number.isInteger(payload.cost)) {
        throw new Error('Cost must be an integer');
      }
      const costBigInt = BigInt(payload.cost);

      // 2. Insert cost_event
      await CostEvent.create(
        {
          projectId: project.id,
          featureId: payload.featureId || null,
          endUserId: payload.userId || null,
          cost: costBigInt,
          currencyCode: project.currencyCode,
        },
        { transaction: t },
      );

      // 3. Upsert daily_cost via atomic POSTGRES increment to prevent heavy traffic race conditions
      // A standard findOrCreate -> update suffers from gap locking race condition failures in Node clusters under heavy load
      await sequelize.query(
        `
        INSERT INTO "daily_costs" 
          ("project_id", "date", "total_cost", "total_requests", "currency_code", "warning_sent", "critical_sent", "created_at", "updated_at") 
        VALUES 
          (:projectId, :date, :cost, 1, :currencyCode, false, false, NOW(), NOW())
        ON CONFLICT ("project_id", "date") 
        DO UPDATE SET 
          "total_cost" = "daily_costs"."total_cost" + EXCLUDED."total_cost",
          "total_requests" = "daily_costs"."total_requests" + 1,
          "updated_at" = NOW()
        `,
        {
          replacements: {
            projectId: project.id,
            date: today,
            cost: costBigInt.toString(), // Send as string to preserve full BIGINT precision in query natively
            currencyCode: project.currencyCode,
          },
          transaction: t,
        },
      );

      // Now fetch the guaranteed locked and correctly incremented row for rules evaluation
      const dailyCost = await DailyCost.findOne({
        where: { projectId: project.id, date: today },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!dailyCost) {
        throw new Error('Failed to fetch daily cost after atomic upsert');
      }

      // 4. Evaluate thresholds
      const limit = project.dailyBudget; // BigInt
      const currentTotal = dailyCost.totalCost; // BigInt

      const percentUsed = limit > 0n ? Number((currentTotal * 100n) / limit) : 0;

      let status: 'normal' | 'warning' | 'critical' = 'normal';
      let alertToTrigger: AlertResult | null = null;

      const warningThreshold = project.alertThreshold ?? BUDGET_WARNING_PERCENT;

      // 5. If threshold crossed -> Update daily_cost + Insert budget_alert
      // Ordering must be strict: evaluate critical first, then warning. Never OR.
      if (percentUsed >= BUDGET_CRITICAL_PERCENT) {
        status = 'critical';
        if (!dailyCost.criticalSent) {
          dailyCost.criticalSent = true;
          await dailyCost.save({ transaction: t });

          await BudgetAlert.create(
            {
              projectId: project.id,
              type: AlertType.CRITICAL,
              cost: currentTotal,
              budget: limit,
              date: today,
              currencyCode: project.currencyCode,
            },
            { transaction: t },
          );

          alertToTrigger = {
            fired: true,
            type: AlertType.CRITICAL,
            projectId: project.id,
            cost: Number(currentTotal),
            budget: Number(limit),
          };
        }
      } else if (percentUsed >= warningThreshold) {
        status = 'warning';
        if (!dailyCost.warningSent && !dailyCost.criticalSent) {
          dailyCost.warningSent = true;
          await dailyCost.save({ transaction: t });

          await BudgetAlert.create(
            {
              projectId: project.id,
              type: AlertType.WARNING,
              cost: currentTotal,
              budget: limit,
              date: today,
              currencyCode: project.currencyCode,
            },
            { transaction: t },
          );

          alertToTrigger = {
            fired: true,
            type: AlertType.WARNING,
            projectId: project.id,
            cost: Number(currentTotal),
            budget: Number(limit),
          };
        }
      }

      // Return evaluation so controller can respond, and pass alert to be processed AFTER commit.
      return {
        budgetStatus: {
          dailyUsed: Number(currentTotal),
          dailyLimit: Number(limit),
          percentUsed,
          status,
        },
        alertToTrigger,
        projectInfo: {
          userId: project.userId,
          name: project.name,
          currencyCode: project.currencyCode,
        },
      };
    });
    // Transaction commits automatically if no error is thrown
  },
};

import { Op, fn, col, literal } from 'sequelize';

import { ProjectStatus, SubscriptionStatus } from '@costshield/shared';
import type {
  DashboardResponse,
  DashboardTrendPoint,
  DashboardProjectSummary,
  DashboardSpike,
  DashboardTrialStatus,
  DashboardBudgetStatus,
} from '@costshield/shared';

import { Project, DailyCost, CostEvent, Subscription } from '../../models';
import { sequelize } from '../../database';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function monthStartStr(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

function rangeStartStr(range: string): string {
  const days = range === '30d' ? 30 : 7;
  const d = new Date();
  d.setDate(d.getDate() - (days - 1)); // inclusive of today
  return d.toISOString().split('T')[0];
}

function fillTrend(rows: { date: string; cost: number }[], range: string): DashboardTrendPoint[] {
  const days = range === '30d' ? 30 : 7;
  const map = new Map<string, number>();
  for (const r of rows) map.set(r.date, r.cost);

  const result: DashboardTrendPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    result.push({ date: dateStr, cost: map.get(dateStr) ?? 0 });
  }
  return result;
}

function budgetStatus(percent: number, alertThreshold: number): DashboardBudgetStatus {
  if (percent >= 100) return 'critical';
  if (percent >= alertThreshold) return 'warning';
  return 'normal';
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const dashboardService = {
  async getDashboard(
    userId: string,
    range: string = '7d',
    projectId?: string,
  ): Promise<DashboardResponse> {
    const today = todayStr();
    const monthStart = monthStartStr();
    const rangeStart = rangeStartStr(range);

    // 1. Fetch user's projects (we need IDs + metadata for multiple queries)
    const projectWhere: Record<string, unknown> = {
      userId,
      status: ProjectStatus.ACTIVE,
    };
    if (projectId) projectWhere.id = projectId;

    const projects = await Project.findAll({
      where: projectWhere,
      attributes: ['id', 'name', 'dailyBudget', 'alertThreshold'],
    });

    const projectIds = projects.map((p) => p.id);
    const activeProjects = projects.length;

    // Edge case: no projects
    if (projectIds.length === 0) {
      const trial = await this.getTrialStatus(userId);
      return {
        todayCost: 0,
        monthCost: 0,
        activeProjects: 0,
        trial,
        trend: fillTrend([], range),
        projectsSummary: [],
        spike: { detected: false },
      };
    }

    // 2. Run aggregation queries in parallel
    const [
      todayCostResult,
      monthCostResult,
      trendRows,
      todayPerProject,
      spikeResult,
      trial,
    ] = await Promise.all([
      // ── Today cost ──
      DailyCost.findOne({
        where: {
          projectId: { [Op.in]: projectIds },
          date: today,
        },
        attributes: [[fn('SUM', col('total_cost')), 'total']],
        raw: true,
      }) as unknown as Promise<{ total: string | null } | null>,

      // ── Month cost ──
      DailyCost.findOne({
        where: {
          projectId: { [Op.in]: projectIds },
          date: { [Op.gte]: monthStart },
        },
        attributes: [[fn('SUM', col('total_cost')), 'total']],
        raw: true,
      }) as unknown as Promise<{ total: string | null } | null>,

      // ── Trend aggregation ──
      DailyCost.findAll({
        where: {
          projectId: { [Op.in]: projectIds },
          date: { [Op.between]: [rangeStart, today] },
        },
        attributes: [
          'date',
          [fn('SUM', col('total_cost')), 'cost'],
        ],
        group: ['date'],
        order: [['date', 'ASC']],
        raw: true,
      }) as unknown as Promise<Array<{ date: string; cost: string }>>,

      // ── Today cost per project (for summary) ──
      DailyCost.findAll({
        where: {
          projectId: { [Op.in]: projectIds },
          date: today,
        },
        attributes: ['projectId', 'totalCost'],
        raw: true,
      }) as unknown as Promise<Array<{ projectId: string; totalCost: string }>>,

      // ── Spike detection ──
      this.detectSpike(projectIds, projects),

      // ── Trial status ──
      this.getTrialStatus(userId),
    ]);

    // 3. Parse scalar results
    const todayCost = Number((todayCostResult as any)?.total ?? 0);
    const monthCost = Number((monthCostResult as any)?.total ?? 0);

    // 4. Build trend (fill missing days with 0)
    const parsedTrend = (trendRows as any[]).map((r) => ({
      date: r.date as string,
      cost: Number(r.cost),
    }));
    const trend = fillTrend(parsedTrend, range);

    // 5. Build projects summary
    const todayCostMap = new Map<string, number>();
    for (const row of todayPerProject as any[]) {
      todayCostMap.set(row.projectId, Number(row.totalCost));
    }

    const projectsSummary: DashboardProjectSummary[] = projects.map((p) => {
      const pTodayCost = todayCostMap.get(p.id) ?? 0;
      const pDailyBudget = Number(p.dailyBudget);
      const pPercent = pDailyBudget > 0
        ? Math.min(Math.round((pTodayCost / pDailyBudget) * 100), 100)
        : 0;

      return {
        id: p.id,
        name: p.name,
        todayCost: pTodayCost,
        dailyBudget: pDailyBudget,
        budgetPercent: pPercent,
        status: budgetStatus(pPercent, p.alertThreshold),
      };
    });

    return {
      todayCost,
      monthCost,
      activeProjects,
      trial,
      trend,
      projectsSummary,
      spike: spikeResult,
    };
  },

  /**
   * Detect if any single cost_event today exceeds 25% of its project's daily budget.
   * Only queries cost_events here (acceptable for spike detection only).
   */
  async detectSpike(
    projectIds: string[],
    projects: Array<{ id: string; name: string; dailyBudget: bigint }>,
  ): Promise<DashboardSpike> {
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    // Find the single largest cost_event today across user's projects
    const largestEvent = await CostEvent.findOne({
      where: {
        projectId: { [Op.in]: projectIds },
        createdAt: { [Op.gte]: todayStart },
      },
      order: [['cost', 'DESC']],
      attributes: ['projectId', 'cost', 'createdAt'],
      raw: true,
    });

    if (!largestEvent) return { detected: false };

    const eventCost = Number(largestEvent.cost);
    const project = projects.find((p) => p.id === largestEvent.projectId);
    if (!project) return { detected: false };

    const dailyBudget = Number(project.dailyBudget);
    const threshold = dailyBudget * 0.25;

    if (dailyBudget > 0 && eventCost > threshold) {
      return {
        detected: true,
        projectName: project.name,
        cost: eventCost,
        time: new Date(largestEvent.createdAt).toISOString(),
      };
    }

    return { detected: false };
  },

  /**
   * Fetch trial/subscription status for the user.
   */
  async getTrialStatus(userId: string): Promise<DashboardTrialStatus> {
    const subscription = await Subscription.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
      attributes: ['currentPeriodEnd'],
    });

    if (!subscription) {
      return { daysRemaining: 0, isExpired: true };
    }

    const endDate = new Date(subscription.currentPeriodEnd);
    const now = new Date();
    const diffMs = endDate.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    return { daysRemaining, isExpired: daysRemaining === 0 };
  },
};

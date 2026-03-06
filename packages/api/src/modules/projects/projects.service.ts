import crypto from 'crypto';
import { Op } from 'sequelize';

import { ProjectStatus, SubscriptionStatus } from '@costshield/shared';
import type {
  ProjectDashboardResponse,
  ProjectTodayUsage,
  ProjectTrendPoint,
  ProjectTrialStatus,
  ProjectAlert,
} from '@costshield/shared';

import { Project, DailyCost, Subscription, BudgetAlert } from '../../models';
import { generateApiKey } from '../../utils/apiKey';

export interface CreateProjectDTO {
  name: string;
  dailyBudget: number; // passed as raw integer string or number representing smallest unit
  monthlyBudget?: number;
  alertThreshold?: number;
}

export const projectsService = {
  /**
   * Generates slug securely to prevent conflicts
   */
  async generateUniqueSlug(name: string, userId: string): Promise<string> {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    let slug = baseSlug || 'project';

    // Check if user already has this slug locally
    const existing = await Project.findOne({ where: { userId, slug } });
    if (!existing) return slug;

    // Very naive conflict resolution tailored for single-owner MVP context
    slug = `${baseSlug}-${crypto.randomBytes(2).toString('hex')}`;
    return slug;
  },

  async createProject(userId: string, data: CreateProjectDTO) {
    const slug = await this.generateUniqueSlug(data.name, userId);
    const { rawKey, keyHash, keyPrefix } = generateApiKey();

    const project = await Project.create({
      userId,
      name: data.name,
      slug,
      status: ProjectStatus.ACTIVE,
      keyPrefix,
      apiKeyHash: keyHash,
      currencyCode: 'USD', // defaulting for now unless user preferences dictate otherwise
      dailyBudget: BigInt(data.dailyBudget),
      monthlyBudget: data.monthlyBudget ? BigInt(data.monthlyBudget) : null,
      alertThreshold: data.alertThreshold ?? 80,
    });

    return { project, rawKey };
  },

  async listProjects(userId: string) {
    const projects = await Project.findAll({
      where: { userId },
      attributes: [
        'id',
        'name',
        'status',
        'dailyBudget',
        'monthlyBudget',
        'alertThreshold',
        'keyPrefix',
        'currencyCode',
        'createdAt',
      ],
      order: [['createdAt', 'DESC']],
    });

    // BigInts must be cast/mapped safely for JSON serialization
    return projects.map((p) => ({
      ...p.get({ plain: true }),
      dailyBudget: Number(p.dailyBudget),
      monthlyBudget: p.monthlyBudget ? Number(p.monthlyBudget) : null,
    }));
  },

  async getProjectById(userId: string, projectId: string) {
    const project = await Project.findOne({
      where: { id: projectId, userId },
      attributes: [
        'id',
        'name',
        'status',
        'dailyBudget',
        'monthlyBudget',
        'alertThreshold',
        'keyPrefix',
        'currencyCode',
        'createdAt',
      ],
    });

    if (!project) return null;

    return {
      ...project.get({ plain: true }),
      dailyBudget: Number(project.dailyBudget),
      monthlyBudget: project.monthlyBudget ? Number(project.monthlyBudget) : null,
    };
  },

  /**
   * Aggregated dashboard response for GET /api/v1/projects/:id
   * Pulls today usage, 7-day trend, and trial status in parallel.
   */
  async getProjectDashboard(userId: string, projectId: string): Promise<ProjectDashboardResponse | null> {
    // 1. Fetch project (ownership check)
    const project = await Project.findOne({
      where: { id: projectId, userId },
      attributes: [
        'id',
        'name',
        'status',
        'dailyBudget',
        'monthlyBudget',
        'alertThreshold',
        'keyPrefix',
        'createdAt',
      ],
    });

    if (!project) return null;

    const dailyBudget = Number(project.dailyBudget);

    // Build date boundaries
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD in UTC
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // includes today = 7 days
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    // 2. Run all three queries in parallel
    const [todayRow, trendRows, subscription] = await Promise.all([
      // Today's usage
      DailyCost.findOne({
        where: { projectId, date: todayStr },
        attributes: ['totalCost', 'totalRequests'],
      }),

      // Last 7 days trend
      DailyCost.findAll({
        where: {
          projectId,
          date: { [Op.between]: [sevenDaysAgoStr, todayStr] },
        },
        attributes: ['date', 'totalCost'],
        order: [['date', 'ASC']],
      }),

      // Active subscription for trial status
      Subscription.findOne({
        where: {
          userId,
          status: SubscriptionStatus.ACTIVE,
        },
        attributes: ['currentPeriodEnd'],
      }),
    ]);

    // 3. Build today usage (safe defaults)
    const todayCost = todayRow ? Number(todayRow.totalCost) : 0;
    const todayRequests = todayRow ? todayRow.totalRequests : 0;
    const budgetPercent = dailyBudget > 0
      ? Math.min(Math.round((todayCost / dailyBudget) * 100), 100)
      : 0;

    const todayUsage: ProjectTodayUsage = {
      cost: todayCost,
      requests: todayRequests,
      budgetPercent,
    };

    // 4. Build 7-day trend (fill missing days with 0)
    const trendMap = new Map<string, number>();
    for (const row of trendRows) {
      trendMap.set(row.date, Number(row.totalCost));
    }

    const trend7d: ProjectTrendPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      trend7d.push({
        date: dateStr,
        cost: trendMap.get(dateStr) ?? 0,
      });
    }

    // 5. Build trial status (safe defaults)
    let trial: ProjectTrialStatus;
    if (subscription) {
      const endDate = new Date(subscription.currentPeriodEnd);
      const now = new Date();
      const diffMs = endDate.getTime() - now.getTime();
      const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      trial = { daysRemaining, isExpired: daysRemaining === 0 };
    } else {
      trial = { daysRemaining: 0, isExpired: true };
    }

    return {
      project: {
        id: project.id,
        name: project.name,
        keyPrefix: project.keyPrefix,
        dailyBudget,
        monthlyBudget: project.monthlyBudget ? Number(project.monthlyBudget) : null,
        alertThreshold: project.alertThreshold,
        status: project.status,
        createdAt: project.createdAt.toISOString(),
      },
      todayUsage,
      trend7d,
      trial,
      integration: {
        sdk_install: "npm install @costshield/sdk",
        api_endpoint: "/api/v1/track",
        api_key_prefix: project.keyPrefix,
      },
    };
  },

  /**
   * Update basic project configuration.
   */
  async updateProjectSettings(
    projectId: string,
    userId: string,
    payload: { name?: string; daily_budget?: number; alert_threshold?: number }
  ) {
    const project = await Project.findOne({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      return null;
    }

    if (payload.name !== undefined) {
      project.name = payload.name;
    }
    if (payload.daily_budget !== undefined) {
      project.dailyBudget = BigInt(payload.daily_budget);
    }
    if (payload.alert_threshold !== undefined) {
      project.alertThreshold = payload.alert_threshold;
    }

    await project.save();

    return {
      id: project.id,
      name: project.name,
      daily_budget: Number(project.dailyBudget),
      alert_threshold: project.alertThreshold,
    };
  },

  /**
   * Fetch recent budget alerts for a project owned by the given user.
   * Returns null if the project doesn't exist or doesn't belong to the user.
   */
  async getProjectAlerts(
    projectId: string,
    userId: string,
    limit: number = 50,
  ): Promise<ProjectAlert[] | null> {
    const project = await Project.findOne({
      where: { id: projectId, userId },
      attributes: ['id'],
    });

    if (!project) return null;

    const alerts = await BudgetAlert.findAll({
      where: { projectId },
      attributes: ['id', 'type', 'cost', 'budget', 'date', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit,
    });

    return alerts.map((a) => ({
      id: a.id,
      type: a.type,
      cost: Number(a.cost),
      budget: Number(a.budget),
      date: a.date,
      sentAt: a.createdAt.toISOString(),
    }));
  },
};

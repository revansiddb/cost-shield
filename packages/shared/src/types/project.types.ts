// =============================
// Project Detail / Dashboard Types
// =============================

export interface ProjectTodayUsage {
  cost: number;        // total cost in smallest unit, converted to number
  requests: number;    // total requests today
  budgetPercent: number; // 0–100, how much of daily budget is consumed
}

export interface ProjectTrendPoint {
  date: string;        // YYYY-MM-DD
  cost: number;        // total cost for that day
}

export interface ProjectTrialStatus {
  daysRemaining: number;  // 0 if expired
  isExpired: boolean;
}

export interface ProjectDetailMeta {
  id: string;
  name: string;
  keyPrefix: string;
  dailyBudget: number;
  monthlyBudget: number | null;
  alertThreshold: number;
  status: string;
  createdAt: string;
}

export interface ProjectIntegrationInfo {
  sdk_install: string;
  api_endpoint: string;
  api_key_prefix: string;
}

export interface ProjectDashboardResponse {
  project: ProjectDetailMeta;
  todayUsage: ProjectTodayUsage;
  trend7d: ProjectTrendPoint[];
  trial: ProjectTrialStatus;
  integration: ProjectIntegrationInfo;
}

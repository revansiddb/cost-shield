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
  trend: ProjectTrendPoint[];
  trial: ProjectTrialStatus;
  integration: ProjectIntegrationInfo;
}

export interface UpdateProjectSettingsRequest {
  name?: string;
  daily_budget?: number;
  alert_threshold?: number;
}

export interface ProjectSettingsResponse {
  id: string;
  name: string;
  daily_budget: number;
  alert_threshold: number;
}

// =============================
// Project Alert History
// =============================

export interface ProjectAlert {
  id: string;
  type: 'warning' | 'critical';
  cost: number;
  budget: number;
  date: string;
  sentAt: string;
}

export interface ProjectAlertsResponse {
  success: true;
  data: ProjectAlert[];
}

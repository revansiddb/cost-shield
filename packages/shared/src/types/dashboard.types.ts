// =============================
// Dashboard / Overview Types
// =============================

export type DashboardBudgetStatus = 'normal' | 'warning' | 'critical';

export interface DashboardTrendPoint {
  date: string;
  cost: number;
}

export interface DashboardProjectSummary {
  id: string;
  name: string;
  todayCost: number;
  dailyBudget: number;
  budgetPercent: number;
  status: DashboardBudgetStatus;
}

export interface DashboardSpike {
  detected: boolean;
  projectName?: string;
  cost?: number;
  time?: string;
}

export interface DashboardTrialStatus {
  daysRemaining: number;
  isExpired: boolean;
}

export interface DashboardResponse {
  todayCost: number;
  monthCost: number;
  activeProjects: number;
  trial: DashboardTrialStatus;
  trend: DashboardTrendPoint[];
  projectsSummary: DashboardProjectSummary[];
  spike: DashboardSpike;
}

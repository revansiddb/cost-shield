import { AlertType } from '../enums';

// =============================
// Track Request (SDK → API)
// =============================
export interface TrackRequestPayload {
  apiKey: string;
  cost: number;
  featureId?: string;
  userId?: string;
  timestamp?: string;
}

// =============================
// Budget Evaluation Result
// =============================
export interface BudgetEvaluationResult {
  dailyUsed: number; // current total cost in smallest unit
  dailyLimit: number; // budget limit in smallest unit
  percentUsed: number; // 0–100
  status: 'normal' | 'warning' | 'critical';
}

// =============================
// Alert Result
// =============================
export interface AlertResult {
  fired: boolean;
  type?: AlertType;
  projectId?: string;
  cost?: number;
  budget?: number;
}

// =============================
// API Responses
// =============================
export interface ApiSuccessResponse<T = undefined> {
  success: true;
  data?: T;
  meta?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

export type ApiResponse<T = undefined> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface TrackResponse {
  success: boolean;
  budgetStatus: BudgetEvaluationResult;
}

// =============================
// User (safe, no secrets)
// =============================
export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

// =============================
// Project
// =============================
export interface ProjectSummary {
  id: string;
  name: string;
  slug?: string;
  status: string;
  keyPrefix: string;
  currency: string;
  dailyBudget: number;
  monthlyBudget?: number;
  alertThreshold: number;
  createdAt: string;
}

export * from './project.types';
export * from './dashboard.types';

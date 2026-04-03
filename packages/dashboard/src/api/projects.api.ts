import { apiClient } from './axios';

export interface Project {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'archived'; // from shared/enums in backend
  dailyBudget: number | null;
  monthlyBudget: number | null;
  alertThreshold: number;
  keyPrefix: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
  dailyBudget?: number;
  monthlyBudget?: number;
  alertThreshold?: number;
}

export interface CreateProjectResponse {
  success: boolean;
  data?: Project & {
    rawApiKey: string; // The backend returns this only once
  };
  error?: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

export const getProjects = async (): Promise<Project[]> => {
  const { data } = await apiClient.get('/projects');
  if (data.success && data.data) {
    return data.data as Project[]; // API returns { success: true, data: [...] }
  }
  return [];
};

export const createProject = async (payload: CreateProjectPayload): Promise<CreateProjectResponse> => {
  try {
    const { data } = await apiClient.post<CreateProjectResponse>('/projects', payload);
    return data;
  } catch (error: any) {
    // Return backend formatted error safely if it's an axios 400/403 wrap
    if (error.response?.data?.error) {
      return error.response.data as CreateProjectResponse;
    }
    throw error;
  }
};

// ─── Project Detail / Dashboard ──────────────────────────────────────────────

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

export interface ProjectTodayUsage {
  cost: number;
  requests: number;
  budgetPercent: number;
}

export interface ProjectTrendPoint {
  date: string;
  cost: number;
}

export interface ProjectTrialStatus {
  daysRemaining: number;
  isExpired: boolean;
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

export const getProjectDetail = async (projectId: string): Promise<ProjectDashboardResponse> => {
  const { data } = await apiClient.get(`/projects/${projectId}`);
  return data.data as ProjectDashboardResponse;
};

// ─── Update Project Settings ─────────────────────────────────────────────────

export interface UpdateProjectPayload {
  name?: string;
  daily_budget?: number;
  alert_threshold?: number;
}

export interface UpdateProjectResponse {
  success: boolean;
  data?: {
    id: string;
    name: string;
    daily_budget: number;
    alert_threshold: number;
  };
  error?: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

// ─── Project Alert History ────────────────────────────────────────────────────

export interface ProjectAlert {
  id: string;
  type: 'warning' | 'critical';
  cost: number;
  budget: number;
  date: string;
  sentAt: string;
}

export const getProjectAlerts = async (projectId: string): Promise<ProjectAlert[]> => {
  const { data } = await apiClient.get(`/projects/${projectId}/alerts`);
  if (data.success && data.data) {
    return data.data as ProjectAlert[];
  }
  return [];
};

// ─── Update Project Settings ─────────────────────────────────────────────────

export const updateProject = async (
  projectId: string,
  payload: UpdateProjectPayload,
): Promise<UpdateProjectResponse> => {
  try {
    const { data } = await apiClient.patch<UpdateProjectResponse>(
      `/projects/${projectId}`,
      payload,
    );
    return data;
  } catch (error: unknown) {
    const axiosErr = error as { response?: { data?: UpdateProjectResponse } };
    if (axiosErr.response?.data?.error) {
      return axiosErr.response.data;
    }
    throw error;
  }
};

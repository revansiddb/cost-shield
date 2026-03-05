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

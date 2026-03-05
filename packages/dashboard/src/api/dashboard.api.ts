import { apiClient } from './axios';
import type { DashboardResponse } from '@costshield/shared';

// Define parameters locally to avoid exporting types not needed broadly
export interface GetDashboardParams {
  range?: '7d' | '30d';
  projectId?: string;
}

export const getDashboard = async (params: GetDashboardParams): Promise<DashboardResponse> => {
  const { data } = await apiClient.get('/dashboard', {
    params: {
      range: params.range,
      project_id: params.projectId === 'all' ? undefined : params.projectId,
    },
  });
  return data.data as DashboardResponse;
};

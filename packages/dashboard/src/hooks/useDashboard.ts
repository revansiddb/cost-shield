import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '../api/dashboard.api';
import type { GetDashboardParams } from '../api/dashboard.api';

export const useDashboard = (params: GetDashboardParams) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard', params],
    queryFn: () => getDashboard(params),
    staleTime: 60 * 1000 * 5, // 5 minutes fresh
  });

  return {
    data: data ?? null,
    isLoading,
    isError,
    error,
  };
};

import { useQuery } from '@tanstack/react-query';
import { getProjectDetail } from '../api/projects.api';
import type { ProjectDashboardResponse } from '../api/projects.api';

export const useProjectDetail = (projectId: string | undefined) => {
  const { data, isLoading, isError, error } = useQuery<ProjectDashboardResponse>({
    queryKey: ['project-detail', projectId],
    queryFn: () => getProjectDetail(projectId!),
    enabled: !!projectId,
  });

  return {
    project: data?.project ?? null,
    todayUsage: data?.todayUsage ?? null,
    trend: data?.trend ?? [],
    trial: data?.trial ?? null,
    integration: data?.integration ?? null,
    isLoading,
    isError,
    error,
  };
};

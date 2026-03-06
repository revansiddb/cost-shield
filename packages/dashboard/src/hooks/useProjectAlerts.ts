import { useQuery } from '@tanstack/react-query';
import { getProjectAlerts } from '../api/projects.api';
import type { ProjectAlert } from '../api/projects.api';

export const useProjectAlerts = (projectId: string | undefined) => {
  const { data, isLoading, isError, error } = useQuery<ProjectAlert[]>({
    queryKey: ['project-alerts', projectId],
    queryFn: () => getProjectAlerts(projectId!),
    enabled: !!projectId,
  });

  return {
    alerts: data ?? [],
    isLoading,
    isError,
    error,
  };
};

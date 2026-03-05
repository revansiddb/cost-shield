import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/axios';

// Reusing shared interface idea, but placing locally for frontend cleanliness if we don't import @costshield/shared
export interface UserInfo {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
}

const fetchMe = async (): Promise<UserInfo | null> => {
  try {
    const { data } = await apiClient.get('/auth/me');
    if (data.success && data.data) {
      return data.data as UserInfo;
    }
    return null;
  } catch (error) {
    // 401s will be caught by interceptor, but we still return null locally
    return null;
  }
};

export const useAuth = () => {
  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchMe,
    retry: false, // Don't retry, either we have a cookie or we don't
    staleTime: 5 * 60 * 1000, // consider session valid for 5 mins before re-fetching implicitly
  });

  return {
    user: user ?? null,
    isLoading,
    isError,
    error,
  };
};

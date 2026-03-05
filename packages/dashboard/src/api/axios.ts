import axios from 'axios';

// Get base URL from environment, or default to the local API
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor - handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is 401 Unauthorized
    if (error.response?.status === 401) {
      // Avoid infinite redirects if we are already on login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login?reason=unauthenticated';
      }
    }
    return Promise.reject(error);
  }
);

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const getApiBaseUrl = (): string => {
  // If explicitly configured via Vite env, respect that
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }
  // Local development on localhost or 127.0.0.1
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')
  ) {
    return 'http://localhost:5000';
  }
  // In production (Vercel, deployed domain), connect to the live Render backend
  return 'https://hireready-ai-qmpy.onrender.com';
};

export const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send and receive HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

// Response interceptor for silent token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || '';

    // If the failed call was ITSELF an auth flow endpoint: NEVER RETRY
    if (
      requestUrl.includes('/api/auth/refresh') ||
      requestUrl.includes('/api/auth/login') ||
      requestUrl.includes('/api/auth/register')
    ) {
      processQueue(error);
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt silent refresh via HttpOnly refresh cookie
        await apiClient.post('/api/auth/refresh');
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError);

        // If refresh fails, session is absent or expired
        // Only redirect if candidate is currently trying to access a protected page
        const currentPath = window.location.pathname;
        const isAuthOrLanding =
          currentPath.startsWith('/auth') || currentPath === '/';

        if (!isAuthOrLanding && !requestUrl.includes('/api/auth/me')) {
          console.warn('Session expired or missing. Redirecting to login...');
          window.location.href = '/auth/login?expired=1';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

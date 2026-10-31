import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 1, // Avoid aggressive retry storms during backend cold-starts
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

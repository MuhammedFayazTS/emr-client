import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import type { ApiError } from './types';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 2,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 0,
        },
    },
    queryCache: new QueryCache({
        onError: (error) => {
            const err = error as ApiError;
            console.error('Query error:', err.message);
            // hook into your toast system here
        },
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            const err = error as ApiError;
            console.error('Mutation error:', err.message);
        },
    }),
});
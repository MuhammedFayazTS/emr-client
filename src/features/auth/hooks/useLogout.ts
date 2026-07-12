import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { authKeys } from '../api/auth.keys';
import type { ApiError } from '@/shared/api/types';
import { notify } from '@/shared/utils/notify';

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError>({
        mutationFn: authApi.logout,
        onSuccess: () => {
            queryClient.setQueryData(authKeys.currentUser(), null);
            queryClient.clear(); // wipe all cached data on logout — avoid leaking prior user's cache
            notify.success("Logged out successfully");
        },
        onError: (error) => {
            notify.error(error, "Failed to log out");
        },
    });
}
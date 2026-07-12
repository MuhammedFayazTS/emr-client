import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { authKeys } from '../api/auth.keys';

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            queryClient.setQueryData(authKeys.currentUser(), null);
            queryClient.clear(); // wipe all cached data on logout — avoid leaking prior user's cache
        },
    });
}
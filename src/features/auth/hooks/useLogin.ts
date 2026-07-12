import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authKeys } from '../api/auth.keys';
import type { ApiError } from '@/shared/api/types';
import type { LoginFormInput } from '../validation/auth.schema';
import type { LoginResponse } from '../types/auth.types';
import { authApi } from '../api/auth.api';
import { notify } from '@/shared/utils/notify';

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation<LoginResponse, ApiError, LoginFormInput>({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            // cache the current user
            queryClient.setQueryData(authKeys.currentUser(), data.user);
            notify.success(`Welcome back, ${data.user.name ?? "there"}!`);
        },
        onError: (error) => {
            notify.error(error, "Invalid email or password");
        },
    });
}
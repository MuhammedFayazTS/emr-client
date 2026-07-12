import { useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentApi } from '../api/department.api';
import { departmentKeys } from '../api/department.keys';
import type { Department } from '../types/department.types';
import type { CreateDepartmentInput } from '../validation/department.schema';
import type { ApiError } from '@/shared/api/types';

export function useCreateDepartment() {
    const queryClient = useQueryClient();

    return useMutation<Department, ApiError, CreateDepartmentInput>({
        mutationFn: departmentApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
        },
    });
}

export function useUpdateDepartment() {
    const queryClient = useQueryClient();

    return useMutation<Department, ApiError, { id: string, payload: CreateDepartmentInput }>({
        mutationFn: departmentApi.update,
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: departmentKeys.detail(id) });
        },
    });
}

export function useDeleteDepartment() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: departmentApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
        },
    });
}
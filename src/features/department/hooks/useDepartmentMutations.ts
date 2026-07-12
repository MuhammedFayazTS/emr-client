import { useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentApi } from '../api/department.api';
import { departmentKeys } from '../api/department.keys';
import type { Department } from '../types/department.types';
import type { CreateDepartmentInput } from '../validation/department.schema';
import type { ApiError } from '@/shared/api/types';
import { notify } from '@/shared/utils/notify';

export function useCreateDepartment() {
    const queryClient = useQueryClient();

    return useMutation<Department, ApiError, CreateDepartmentInput>({
        mutationFn: departmentApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
            notify.created("Department");
        },
        onError: (error) => {
            notify.error(error, "Failed to create department");
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
            notify.updated("Department");
        },
        onError: (error) => {
            notify.error(error, "Failed to update department");
        },
    });
}

export function useDeleteDepartment() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: departmentApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
            notify.deleted("Department");
        },
        onError: (error) => {
            notify.error(error, "Failed to delete department");
        },
    });
}
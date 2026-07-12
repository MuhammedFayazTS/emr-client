import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorApi } from '../api/doctor.api';
import { doctorKeys } from '../api/doctor.keys';
import type { Doctor } from '../types/doctor.types';
import type { CreateDoctorInput } from '../validation/doctor.schema';
import type { ApiError } from '@/shared/api/types';
import { notify } from '@/shared/utils/notify';

export function useCreateDoctor() {
    const queryClient = useQueryClient();
    return useMutation<Doctor, ApiError, CreateDoctorInput>({
        mutationFn: doctorApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
            notify.created("Doctor");
        },
        onError: (error) => {
            notify.error(error, "Failed to create doctor");
        },
    });
}

export function useUpdateDoctor() {
    const queryClient = useQueryClient();
    return useMutation<Doctor, ApiError, { id: string, payload: CreateDoctorInput }>({
        mutationFn: doctorApi.update,
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
            queryClient.invalidateQueries({ queryKey: doctorKeys.detail(id) });
            notify.updated("Doctor");
        },
        onError: (error) => {
            notify.error(error, "Failed to update doctor");
        },
    });
}

export function useDeleteDoctor() {
    const queryClient = useQueryClient();
    return useMutation<void, ApiError, string>({
        mutationFn: doctorApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
            notify.deleted("Doctor");
        },
        onError: (error) => {
            notify.error(error, "Failed to delete doctor");
        },
    });
}

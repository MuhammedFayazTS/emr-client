import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patientApi } from '../api/patient.api';
import { patientKeys } from '../api/patient.keys';
import { notify } from '@/shared/utils/notify';

export function useCreatePatient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: patientApi.create,
        onSuccess: () => {
            notify.success('Patient created successfully');
            queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
        },
        onError: (error) => {
            notify.error(error, 'Failed to create patient');
        },
    });
}

export function useUpdatePatient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: patientApi.update,
        onSuccess: (_, variables) => {
            notify.success('Patient updated successfully');
            queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
            queryClient.invalidateQueries({ queryKey: patientKeys.detail(variables.id) });
        },
        onError: (error) => {
            notify.error(error, 'Failed to update patient');
        },
    });
}

export function useUpdatePatientStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: patientApi.updateStatus,
        onSuccess: (_, variables) => {
            notify.success('Patient status updated successfully');
            queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
            queryClient.invalidateQueries({ queryKey: patientKeys.detail(variables.id) });
        },
        onError: (error) => {
            notify.error(error, 'Failed to update patient status');
        },
    });
}

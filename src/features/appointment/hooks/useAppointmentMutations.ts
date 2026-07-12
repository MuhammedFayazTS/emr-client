import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { appointmentApi } from '../api/appointment.api';
import { appointmentKeys } from '../api/appointment.keys';
import type { Appointment, AppointmentFilters } from '../types/appointment.types';
import type { CreateAppointmentInput, UpdateAppointmentInput, CancelAppointmentInput } from '../validation/appointment.schema';
import type { ApiError, PaginatedResponse } from '@/shared/api/types';
import { notify } from '@/shared/utils/notify';

function patchAppointmentInListCaches(queryClient: QueryClient, updated: Appointment) {
    const queries = queryClient.getQueriesData<PaginatedResponse<Appointment[]>>({
        queryKey: appointmentKeys.lists(),
    });

    for (const [queryKey, cached] of queries) {
        if (!cached) continue;

        const filters = queryKey[2] as AppointmentFilters | undefined;
        const statusFilter = filters?.status;
        const matchesFilter = !statusFilter || updated.status === statusFilter;

        const nextData = matchesFilter
            ? cached.data.map((appointment) =>
                appointment.id === updated.id
                    ? {
                        ...appointment,
                        status: updated.status,
                        cancelledAt: updated.cancelledAt,
                        cancelReason: updated.cancelReason,
                        updatedAt: updated.updatedAt,
                    }
                    : appointment,
            )
            : cached.data.filter((appointment) => appointment.id !== updated.id);

        queryClient.setQueryData<PaginatedResponse<Appointment[]>>(queryKey, {
            ...cached,
            data: nextData,
        });
    }
}

function patchAppointmentDetailCache(queryClient: QueryClient, updated: Appointment) {
    const existing = queryClient.getQueryData<Appointment>(appointmentKeys.detail(updated.id));

    queryClient.setQueryData<Appointment>(
        appointmentKeys.detail(updated.id),
        existing
            ? {
                ...existing,
                status: updated.status,
                cancelledAt: updated.cancelledAt,
                cancelReason: updated.cancelReason,
                updatedAt: updated.updatedAt,
            }
            : updated,
    );
}

function syncAppointmentCaches(queryClient: QueryClient, updated: Appointment) {
    patchAppointmentInListCaches(queryClient, updated);
    patchAppointmentDetailCache(queryClient, updated);
}

export function useCreateAppointment() {
    const queryClient = useQueryClient();

    return useMutation<Appointment, ApiError, CreateAppointmentInput>({
        mutationFn: appointmentApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
            notify.created("Appointment");
        },
        onError: (error) => {
            notify.error(error, "Failed to create appointment");
        },
    });
}

export function useUpdateAppointment() {
    const queryClient = useQueryClient();

    return useMutation<Appointment, ApiError, { id: string; payload: UpdateAppointmentInput }>({
        mutationFn: appointmentApi.update,
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(id) });
            notify.updated("Appointment");
        },
        onError: (error) => {
            notify.error(error, "Failed to update appointment");
        },
    });
}

export function useArriveAppointment() {
    const queryClient = useQueryClient();

    return useMutation<Appointment, ApiError, string>({
        mutationFn: appointmentApi.arrive,
        onSuccess: (updated) => {
            syncAppointmentCaches(queryClient, updated);
            notify.success("Appointment marked as arrived");
        },
        onError: (error) => {
            notify.error(error, "Failed to mark appointment as arrived");
        },
    });
}

export function useCompleteAppointment() {
    const queryClient = useQueryClient();

    return useMutation<Appointment, ApiError, string>({
        mutationFn: appointmentApi.complete,
        onSuccess: (updated) => {
            syncAppointmentCaches(queryClient, updated);
            notify.success("Appointment completed");
        },
        onError: (error) => {
            notify.error(error, "Failed to complete appointment");
        },
    });
}

export function useCancelAppointment() {
    const queryClient = useQueryClient();

    return useMutation<Appointment, ApiError, { id: string; payload: CancelAppointmentInput }>({
        mutationFn: appointmentApi.cancel,
        onSuccess: (updated) => {
            syncAppointmentCaches(queryClient, updated);
            notify.success("Appointment cancelled");
        },
        onError: (error) => {
            notify.error(error, "Failed to cancel appointment");
        },
    });
}

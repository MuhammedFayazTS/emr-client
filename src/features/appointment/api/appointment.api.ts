import { axiosInstance } from '@/shared/api/axiosInstance';
import type { ApiSuccessResponse, PaginatedResponse } from '@/shared/api/types';
import type {
    Appointment,
    AppointmentFilters,
    CancelAppointmentPayload,
    CreateAppointmentPayload,
    UpdateAppointmentPayload,
} from '../types/appointment.types';

export const appointmentApi = {
    getList: async (filters: AppointmentFilters): Promise<PaginatedResponse<Appointment[]>> => {
        const res = await axiosInstance.get<PaginatedResponse<Appointment[]>>(
            '/appointments',
            { params: filters }
        );
        return res.data;
    },

    getOne: async (id: string): Promise<Appointment> => {
        const res = await axiosInstance.get<ApiSuccessResponse<Appointment>>(
            `/appointments/${id}`
        );
        return res.data.data;
    },

    create: async (payload: CreateAppointmentPayload): Promise<Appointment> => {
        const res = await axiosInstance.post<ApiSuccessResponse<Appointment>>(
            '/appointments',
            payload
        );
        return res.data.data;
    },

    update: async ({ id, payload }: { id: string; payload: UpdateAppointmentPayload }): Promise<Appointment> => {
        const res = await axiosInstance.patch<ApiSuccessResponse<Appointment>>(
            `/appointments/${id}`,
            payload
        );
        return res.data.data;
    },

    arrive: async (id: string): Promise<Appointment> => {
        const res = await axiosInstance.patch<ApiSuccessResponse<Appointment>>(
            `/appointments/${id}/arrive`
        );
        return res.data.data;
    },

    complete: async (id: string): Promise<Appointment> => {
        const res = await axiosInstance.patch<ApiSuccessResponse<Appointment>>(
            `/appointments/${id}/complete`
        );
        return res.data.data;
    },

    cancel: async ({ id, payload }: { id: string; payload: CancelAppointmentPayload }): Promise<Appointment> => {
        const res = await axiosInstance.patch<ApiSuccessResponse<Appointment>>(
            `/appointments/${id}/cancel`,
            payload
        );
        return res.data.data;
    },
};

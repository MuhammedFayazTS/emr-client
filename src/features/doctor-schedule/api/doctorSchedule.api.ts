import { axiosInstance } from '@/shared/api/axiosInstance';
import type { ApiSuccessResponse, PaginatedResponse } from '@/shared/api/types';
import type {
    DoctorSchedule,
    DoctorScheduleFilters,
    CreateDoctorSchedulePayload,
} from '../types/doctorSchedule.types';

export const doctorScheduleApi = {
    getList: async (filters: DoctorScheduleFilters): Promise<PaginatedResponse<DoctorSchedule[]>> => {
        const res = await axiosInstance.get<PaginatedResponse<DoctorSchedule[]>>(
            '/doctor-schedules',
            { params: filters }
        );
        return res.data;
    },

    getOne: async (id: string): Promise<DoctorSchedule> => {
        const res = await axiosInstance.get<ApiSuccessResponse<DoctorSchedule>>(
            `/doctor-schedules/${id}`
        );
        return res.data.data;
    },

    getByDoctorId: async (doctorId: string): Promise<DoctorSchedule | null> => {
        const res = await axiosInstance.get<ApiSuccessResponse<DoctorSchedule | null>>(
            `/doctor-schedules/doctor/${doctorId}`
        );
        return res.data.data;
    },

    create: async (payload: CreateDoctorSchedulePayload): Promise<DoctorSchedule> => {
        const res = await axiosInstance.post<ApiSuccessResponse<DoctorSchedule>>(
            '/doctor-schedules',
            payload
        );
        return res.data.data;
    },

    update: async ({ id, payload }: { id: string; payload: CreateDoctorSchedulePayload }): Promise<DoctorSchedule> => {
        const res = await axiosInstance.put<ApiSuccessResponse<DoctorSchedule>>(
            `/doctor-schedules/${id}`,
            payload
        );
        return res.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/doctor-schedules/${id}`);
    },
};  
import { axiosInstance } from '@/shared/api/axiosInstance';
import type { ApiSuccessResponse, PaginatedResponse } from '@/shared/api/types';
import type {
    Doctor,
    DoctorFilters,
    CreateDoctorPayload,
} from '../types/doctor.types';

export const doctorApi = {
    getList: async (filters: DoctorFilters): Promise<PaginatedResponse<Doctor[]>> => {
        const res = await axiosInstance.get<PaginatedResponse<Doctor[]>>(
            '/doctors',
            { params: filters }
        );
        return res.data;
    },

    getOne: async (id: string): Promise<Doctor> => {
        const res = await axiosInstance.get<ApiSuccessResponse<Doctor>>(
            `/doctors/${id}`
        );
        return res.data.data;
    },

    create: async (payload: CreateDoctorPayload): Promise<Doctor> => {
        const res = await axiosInstance.post<ApiSuccessResponse<Doctor>>(
            '/doctors',
            payload
        );
        return res.data.data;
    },

    update: async ({ id, payload }: { id: string, payload: CreateDoctorPayload }): Promise<Doctor> => {
        const res = await axiosInstance.put<ApiSuccessResponse<Doctor>>(
            `/doctors/${id}`,
            payload
        );
        return res.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/doctors/${id}`);
    },
};

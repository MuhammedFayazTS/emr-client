import { axiosInstance } from '@/shared/api/axiosInstance';
import type { ApiSuccessResponse, PaginatedResponse } from '@/shared/api/types';
import type { CreateReceptionistPayload, Receptionist, ReceptionistFilters } from '../types/receptionist.types';


export const receptionistApi = {
    getList: async (filters: ReceptionistFilters): Promise<PaginatedResponse<Receptionist[]>> => {
        const res = await axiosInstance.get<PaginatedResponse<Receptionist[]>>(
            '/receptionists',
            { params: filters }
        );
        return res.data;
    },

    getOne: async (id: string): Promise<Receptionist> => {
        const res = await axiosInstance.get<ApiSuccessResponse<Receptionist>>(
            `/receptionists/${id}`
        );
        return res.data.data;
    },

    create: async (payload: CreateReceptionistPayload): Promise<Receptionist> => {
        const res = await axiosInstance.post<ApiSuccessResponse<Receptionist>>(
            '/receptionists',
            payload
        );
        return res.data.data;
    },

    update: async ({ id, payload }: { id: string, payload: CreateReceptionistPayload }): Promise<Receptionist> => {
        const res = await axiosInstance.put<ApiSuccessResponse<Receptionist>>(
            `/receptionists/${id}`,
            payload
        );
        return res.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/receptionists/${id}`);
    },
};

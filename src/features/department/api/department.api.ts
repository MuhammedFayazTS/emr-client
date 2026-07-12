import { axiosInstance } from '@/shared/api/axiosInstance';
import type { ApiSuccessResponse, PaginatedResponse } from '@/shared/api/types';
import type {
    Department,
    DepartmentFilters,
    CreateDepartmentPayload,
} from '../types/department.types';

export const departmentApi = {
    getList: async (filters: DepartmentFilters): Promise<PaginatedResponse<Department[]>> => {
        const res = await axiosInstance.get<PaginatedResponse<Department[]>>(
            '/departments',
            { params: filters }
        );
        return res.data;
    },

    getOne: async (id: string): Promise<Department> => {
        const res = await axiosInstance.get<ApiSuccessResponse<Department>>(
            `/departments/${id}`
        );
        return res.data.data;
    },

    create: async (payload: CreateDepartmentPayload): Promise<Department> => {
        const res = await axiosInstance.post<ApiSuccessResponse<Department>>(
            '/departments',
            payload
        );
        return res.data.data;
    },

    update: async ({ id, payload }: { id: string, payload: CreateDepartmentPayload }): Promise<Department> => {
        const res = await axiosInstance.put<ApiSuccessResponse<Department>>(
            `/departments/${id}`,
            payload
        );
        return res.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/departments/${id}`);
    },
};  
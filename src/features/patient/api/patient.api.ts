import { axiosInstance } from "@/shared/api/axiosInstance";
import type { ApiSuccessResponse, PaginatedResponse } from "@/shared/api/types";
import type { CreatePatientPayload, Patient, PatientFilters } from "../types/patient.types";

export const patientApi = {
  getList: async (filters: PatientFilters): Promise<PaginatedResponse<Patient[]>> => {
    const res = await axiosInstance.get<PaginatedResponse<Patient[]>>("/patients", {
      params: filters,
    });
    return res.data;
  },

  getOne: async (id: string): Promise<Patient> => {
    const res = await axiosInstance.get<ApiSuccessResponse<Patient>>(`/patients/${id}`);
    return res.data.data;
  },

  create: async (payload: CreatePatientPayload): Promise<Patient> => {
    const res = await axiosInstance.post<ApiSuccessResponse<Patient>>("/patients", payload);
    return res.data.data;
  },

  update: async ({
    id,
    payload,
  }: {
    id: string;
    payload: Partial<CreatePatientPayload>;
  }): Promise<Patient> => {
    const res = await axiosInstance.put<ApiSuccessResponse<Patient>>(`/patients/${id}`, payload);
    return res.data.data;
  },

  updateStatus: async ({ id, isActive }: { id: string; isActive: boolean }): Promise<Patient> => {
    const res = await axiosInstance.patch<ApiSuccessResponse<Patient>>(`/patients/${id}/status`, {
      isActive,
    });
    return res.data.data;
  },
};

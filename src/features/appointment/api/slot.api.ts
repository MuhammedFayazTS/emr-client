import type { ApiSuccessResponse } from "@/shared/api/types";
import type { GroupedSlots } from "../types/slot.types";
import { axiosInstance } from "@/shared/api/axiosInstance";

export const slotApi = {
  getList: async (doctorId: string, date: string): Promise<ApiSuccessResponse<GroupedSlots>> => {
    const res = await axiosInstance.get<ApiSuccessResponse<GroupedSlots>>(`/slots/${doctorId}`, {
      params: {
        date: date,
      },
    });
    return res.data;
  },
};

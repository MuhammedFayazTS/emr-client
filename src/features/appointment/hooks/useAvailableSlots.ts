import { useQuery } from "@tanstack/react-query";
import { slotKeys } from "../api/slot.keys";
import { slotApi } from "../api/slot.api";

export function useAvailableSlots(doctorId: string, date: string) {
    return useQuery({
        queryKey: slotKeys.list(doctorId, date),
        select: (data => data?.data),
        queryFn: () => slotApi.getList(doctorId, date),
        enabled: !!doctorId && !!date
    });
}
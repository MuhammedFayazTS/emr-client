import { useQuery } from "@tanstack/react-query";
import { appointmentApi } from "../api/appointment.api";
import { appointmentKeys } from "../api/appointment.keys";
import type { AppointmentFilters } from "../types/appointment.types";

export function useGetAppointments(filters: AppointmentFilters = {}) {
  return useQuery({
    queryKey: appointmentKeys.list(filters),
    queryFn: () => appointmentApi.getList(filters),
  });
}

export function useGetAppointment(id: string) {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => appointmentApi.getOne(id),
    enabled: !!id,
  });
}

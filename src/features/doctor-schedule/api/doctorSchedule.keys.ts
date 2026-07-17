import type { DoctorScheduleFilters } from "../types/doctorSchedule.types";

export const doctorScheduleKeys = {
  all: ["doctor-schedules"] as const,
  lists: () => [...doctorScheduleKeys.all, "list"] as const,
  list: (filters: DoctorScheduleFilters) => [...doctorScheduleKeys.lists(), filters] as const,
  details: () => [...doctorScheduleKeys.all, "detail"] as const,
  detail: (id: string) => [...doctorScheduleKeys.details(), id] as const,
  byDoctor: (doctorId: string) => [...doctorScheduleKeys.all, "by-doctor", doctorId] as const,
};

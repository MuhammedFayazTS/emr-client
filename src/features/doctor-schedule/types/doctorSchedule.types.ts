import type { DayOfWeek } from "@/shared/constants/days";

export interface TimeSlot {
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

export interface DaySchedule {
  day: DayOfWeek;
  isAvailable: boolean;
  slots: TimeSlot[];
}

export interface DoctorSchedule {
  id: string;
  doctorId: {
    id: string;
    _id?: string; // same backend inconsistency as Doctor.department
    name: string;
  };
  slotDuration: number;
  workingDays: WorkingDayPayload[];
  isActive: boolean;
  createdAt: string;
}

export interface DoctorScheduleFilters {
  search?: string;
  cursor?: string;
  limit?: number;
}

export type BackendDayOfWeek =
  "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export interface ScheduleSession {
  startTime: string;
  endTime: string;
  name: string;
}

export interface WorkingDayPayload {
  dayOfWeek: BackendDayOfWeek;
  isWorking: boolean;
  sessions: ScheduleSession[];
}

export interface CreateDoctorSchedulePayload {
  doctorId: string;
  isActive: boolean;
  slotDuration: number;
  workingDays: WorkingDayPayload[];
}

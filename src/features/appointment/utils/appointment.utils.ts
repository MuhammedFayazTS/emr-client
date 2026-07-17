import type { AppointmentRef, AppointmentStatusTypes } from "../types/appointment.types";
import { AppointmentStatus as Status } from "../types/appointment.types";

export function resolveEntityLabel(entity: string | AppointmentRef | undefined): string {
  if (!entity) return "—";
  if (typeof entity === "string") return entity;
  if (entity.firstName) return `${entity.firstName} ${entity.lastName ?? ""}`.trim();
  if (entity.patientId) return entity.patientId;
  return entity.name ?? "—";
}

export function formatAppointmentDate(date: string): string {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatAppointmentTime(startTime: string, endTime: string): string {
  return `${startTime} – ${endTime}`;
}

export function getStatusLabel(status: AppointmentStatusTypes): string {
  return status.replace(/_/g, " ");
}

export const appointmentStatusOptions = [
  { label: "All statuses", value: "" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Arrived", value: "ARRIVED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "No Show", value: "NO_SHOW" },
] as const;

export function canEditAppointment(status: AppointmentStatusTypes): boolean {
  return status !== Status.CANCELLED && status !== Status.COMPLETED;
}

export function canCancelAppointment(status: AppointmentStatusTypes): boolean {
  return status !== Status.CANCELLED && status !== Status.COMPLETED;
}

export function canArriveAppointment(status: AppointmentStatusTypes): boolean {
  return status === Status.SCHEDULED;
}

export function canCompleteAppointment(status: AppointmentStatusTypes): boolean {
  return status === Status.ARRIVED || status === Status.IN_PROGRESS;
}

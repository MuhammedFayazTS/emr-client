import type { ColumnDef } from "@tanstack/react-table";
import type { Appointment, AppointmentStatusTypes, AppointmentTableMeta } from "../types/appointment.types";
import { TableRowActions } from "@/shared/components/core/table/DataTableRowActions";
import { Badge } from "@/shared/components/ui/badge";
import { AppointmentWorkflowActions } from "./AppointmentWorkflowActions";
import {
  canEditAppointment,
  formatAppointmentDate,
  formatAppointmentTime,
  getStatusLabel,
  resolveEntityLabel,
} from "../utils/appointment.utils";
import { AppointmentStatus } from "../types/appointment.types";

function getStatusVariant(
  status: AppointmentStatusTypes,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case AppointmentStatus.COMPLETED:
      return "default";
    case AppointmentStatus.CANCELLED:
      return "destructive";
    case AppointmentStatus.IN_PROGRESS:
    case AppointmentStatus.ARRIVED:
      return "outline";
    default:
      return "secondary";
  }
}

export function getAppointmentColumns(): ColumnDef<Appointment>[] {
  return [
    {
      accessorKey: "appointmentNumber",
      header: "Appointment #",
      cell: ({ row }) => <span className="font-medium">{row.getValue("appointmentNumber")}</span>,
    },
    {
      id: "patient",
      header: "Patient",
      cell: ({ row }) => resolveEntityLabel(row.original.patientId),
    },
    {
      id: "doctor",
      header: "Doctor",
      cell: ({ row }) => resolveEntityLabel(row.original.doctorId),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatAppointmentDate(row.getValue<string>("date"))}
        </span>
      ),
    },
    {
      id: "time",
      header: "Time",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatAppointmentTime(row.original.startTime, row.original.endTime)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue<AppointmentStatusTypes>("status");
        return <Badge variant={getStatusVariant(status)}>{getStatusLabel(status)}</Badge>;
      },
    },
    {
      id: "workflow",
      header: "Workflow",
      size: 220,
      cell: ({ row, table }) => {
        const { onArrive, onComplete, onCancel, pendingAction } = (table.options.meta ??
          {}) as AppointmentTableMeta;

        return (
          <AppointmentWorkflowActions
            appointment={row.original}
            pendingAction={pendingAction}
            onArrive={onArrive}
            onComplete={onComplete}
            onCancel={onCancel}
          />
        );
      },
    },
    {
      id: "actions",
      header: "",
      size: 120,
      cell: ({ row, table }) => {
        const { onView, onEdit } = table.options.meta ?? {};
        const canEdit = canEditAppointment(row.original.status);

        return (
          <TableRowActions
            row={row.original}
            onView={onView}
            onEdit={canEdit ? onEdit : undefined}
            isDeleting={false}
          />
        );
      },
    },
  ];
}

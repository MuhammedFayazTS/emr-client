import type { ColumnDef } from "@tanstack/react-table";
import type { DoctorSchedule } from "../types/doctorSchedule.types";
import { TableRowActions } from "@/shared/components/core/table/DataTableRowActions";
import { Badge } from "@/shared/components/ui/badge";

export function getDoctorScheduleColumns(): ColumnDef<DoctorSchedule>[] {
  return [
    {
      id: "doctor",
      header: "Doctor",
      cell: ({ row }) => <span className="font-medium">{row.original.doctorId?.name ?? "—"}</span>,
    },
    {
      accessorKey: "slotDuration",
      header: "Slot Duration",
      cell: ({ row }) => `${row.getValue<number>("slotDuration")} min`,
    },
    {
      id: "availableDays",
      header: "Available Days",
      cell: ({ row }) => {
        const count = row.original.workingDays?.filter((d) => d.isWorking).length;
        return `${count} / 7 days`;
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("isActive") ? "default" : "secondary"}>
          {row.getValue("isActive") ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 120,
      cell: ({ row, table }) => {
        const { onView, onEdit, onDelete, isDeleting = false } = table.options.meta ?? {};
        return (
          <TableRowActions
            row={row.original}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        );
      },
    },
  ];
}

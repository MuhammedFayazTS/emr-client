import { useCallback, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { useDoctorSchedules } from "../hooks/useDoctorScheduleQueries";
import { useDeleteDoctorSchedule } from "../hooks/useDoctorScheduleMutations";
import { getDoctorScheduleColumns } from "../components/doctorScheduleColumns";
import type { DoctorSchedule } from "../types/doctorSchedule.types";
import { DefaultTable } from "@/shared/components/core/table/DefaultTable";
import { DefaultTableSkeleton } from "@/shared/components/core/table/DefaultTableSkelton";
import { Input } from "@/shared/components/ui/input";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { ViewDetailModal, type ViewDetailField } from "@/shared/components/core/ViewDetailModal";
import { Search } from "lucide-react";

const PAGE_SIZE = 10;

export default function DoctorScheduleList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [currentCursor, setCurrentCursor] = useState<string | undefined>();
  const [cursorStack, setCursorStack] = useState<(string | undefined)[]>([]);
  const pageIndex = cursorStack.length;

  const { data, isLoading, error } = useDoctorSchedules({
    search: debouncedSearch || undefined,
    cursor: currentCursor,
    limit: PAGE_SIZE,
  });

  const { mutate: deleteSchedule, isPending: isDeleting } = useDeleteDoctorSchedule();

  const hasNextPage = data?.pagination?.hasNextPage ?? false;

  const goToNextPage = useCallback(() => {
    if (!data?.pagination?.nextCursor) return;
    setCursorStack((prev) => [...prev, currentCursor]);
    setCurrentCursor(data.pagination?.nextCursor);
  }, [currentCursor, data?.pagination?.nextCursor]);

  const goToPrevPage = useCallback(() => {
    setCursorStack((prev) => {
      const stack = [...prev];
      const prevCursor = stack.pop();
      setCurrentCursor(prevCursor);
      return stack;
    });
  }, []);

  const goToFirstPage = useCallback(() => {
    setCursorStack([]);
    setCurrentCursor(undefined);
  }, []);

  const resetPagination = useCallback(() => {
    setCursorStack([]);
    setCurrentCursor(undefined);
  }, []);

  const [selectedSchedule, setSelectedSchedule] = useState<DoctorSchedule | null>(null);

  const viewFields: ViewDetailField[] = useMemo(() => {
    if (!selectedSchedule) return [];
    return [
      { label: "Doctor", value: selectedSchedule.doctorId?.name ?? "—" },
      { label: "Slot Duration", value: `${selectedSchedule.slotDuration} min` },
      {
        label: "Available Days",
        value:
          selectedSchedule.workingDays
            .filter((d) => d.isWorking)
            .map((d) => d.dayOfWeek)
            .join(", ") || "—",
      },
      { label: "Status", value: selectedSchedule.isActive ? "Active" : "Inactive" },
      {
        label: "Created At",
        value: new Date(selectedSchedule.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      },
    ];
  }, [selectedSchedule]);

  const columns = useMemo(() => getDoctorScheduleColumns(), []);
  const schedules = useMemo(() => data?.data ?? [], [data?.data]);

  const table = useReactTable({
    data: schedules,
    columns,
    pageCount: hasNextPage ? pageIndex + 2 : pageIndex + 1,
    state: {
      pagination: { pageIndex, pageSize: PAGE_SIZE },
    },
    onPaginationChange: (updater) => {
      const prev = { pageIndex, pageSize: PAGE_SIZE };
      const next = typeof updater === "function" ? updater(prev) : updater;

      if (next.pageIndex === 0 && pageIndex !== 0) {
        goToFirstPage();
      } else if (next.pageIndex > pageIndex) {
        goToNextPage();
      } else if (next.pageIndex < pageIndex) {
        goToPrevPage();
      }
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    meta: {
      onView: (schedule: DoctorSchedule) => setSelectedSchedule(schedule),
      onEdit: (schedule: DoctorSchedule) => navigate(`/doctor-schedules/edit/${schedule.id}`),
      onDelete: (schedule: DoctorSchedule) => deleteSchedule(schedule.id),
      isDeleting,
    },
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search schedules..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            resetPagination();
          }}
          className="pl-8"
        />
      </div>

      {isLoading ? (
        <DefaultTableSkeleton
          columnCount={5}
          rowCount={5}
          searchableColumnCount={0}
          showViewOptions={false}
        />
      ) : (
        <DefaultTable table={table} />
      )}

      <ViewDetailModal
        open={!!selectedSchedule}
        onOpenChange={(open) => {
          if (!open) setSelectedSchedule(null);
        }}
        title="Schedule Details"
        fields={viewFields}
      />
    </div>
  );
}

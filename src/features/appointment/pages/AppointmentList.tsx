import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { getAppointmentColumns } from "../components/appointmentColumns";
import type { Appointment, AppointmentStatus } from "../types/appointment.types";
import { DefaultTable } from "@/shared/components/core/table/DefaultTable";
import { DefaultTableSkeleton } from "@/shared/components/core/table/DefaultTableSkelton";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { ViewDetailModal, type ViewDetailField } from "@/shared/components/core/ViewDetailModal";
import { DefaultSelect } from "@/shared/components/core/DefaultSelect";
import { useForm } from "react-hook-form";
import { useGetAppointments, useGetAppointment } from "../hooks/useAppointmentQueries";
import {
  useArriveAppointment,
  useCancelAppointment,
  useCompleteAppointment,
} from "../hooks/useAppointmentMutations";
import { CancelAppointmentDialog } from "../components/CancelAppointmentDialog";
import type { WorkflowAction } from "../components/AppointmentWorkflowActions";
import type { CancelAppointmentInput } from "../validation/appointment.schema";
import {
  appointmentStatusOptions,
  formatAppointmentDate,
  formatAppointmentTime,
  getStatusLabel,
  resolveEntityLabel,
} from "../utils/appointment.utils";
import { Skeleton } from "@/shared/components/ui/skeleton";

const PAGE_SIZE = 10;

type FilterFormValues = {
  status: string;
};

export default function AppointmentList() {
  const navigate = useNavigate();

  const filterForm = useForm<FilterFormValues>({
    defaultValues: { status: "" },
  });

  const selectedStatus = filterForm.watch("status") as AppointmentStatus | "";

  const [currentCursor, setCurrentCursor] = useState<string | undefined>();
  const [cursorStack, setCursorStack] = useState<(string | undefined)[]>([]);
  const pageIndex = cursorStack.length;

  const { data, isLoading, error } = useGetAppointments({
    status: selectedStatus || undefined,
    cursor: currentCursor,
    limit: PAGE_SIZE,
  });

  const {
    mutate: arriveAppointment,
    isPending: isArriving,
    variables: arriveId,
  } = useArriveAppointment();
  const {
    mutate: completeAppointment,
    isPending: isCompleting,
    variables: completeId,
  } = useCompleteAppointment();
  const {
    mutate: cancelAppointment,
    isPending: isCancelling,
    variables: cancelVars,
  } = useCancelAppointment();

  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);

  const pendingAction = useMemo(() => {
    if (isArriving && arriveId) return { id: arriveId, type: "arrive" as WorkflowAction };
    if (isCompleting && completeId) return { id: completeId, type: "complete" as WorkflowAction };
    if (isCancelling && cancelVars?.id)
      return { id: cancelVars.id, type: "cancel" as WorkflowAction };
    return undefined;
  }, [isArriving, arriveId, isCompleting, completeId, isCancelling, cancelVars?.id]);

  const hasNextPage = data?.pagination?.hasNextPage ?? false;

  const goToNextPage = useCallback(() => {
    if (!data?.pagination?.nextCursor) return;
    setCursorStack((prev) => [...prev, currentCursor]);
    setCurrentCursor(data.pagination.nextCursor);
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

  const [viewId, setViewId] = useState<string | null>(null);
  const { data: viewAppointment, isLoading: isViewLoading } = useGetAppointment(viewId ?? "");

  const viewFields: ViewDetailField[] = useMemo(() => {
    if (!viewAppointment) return [];

    return [
      { label: "Appointment #", value: viewAppointment.appointmentNumber },
      { label: "Patient", value: resolveEntityLabel(viewAppointment.patientId) },
      { label: "Doctor", value: resolveEntityLabel(viewAppointment.doctorId) },
      { label: "Department", value: resolveEntityLabel(viewAppointment.departmentId) },
      { label: "Date", value: formatAppointmentDate(viewAppointment.date) },
      {
        label: "Time",
        value: formatAppointmentTime(viewAppointment.startTime, viewAppointment.endTime),
      },
      { label: "Status", value: getStatusLabel(viewAppointment.status) },
      { label: "Purpose", value: viewAppointment.purpose || "—" },
      { label: "Notes", value: viewAppointment.notes || "—" },
      ...(viewAppointment.cancelReason
        ? [{ label: "Cancel Reason", value: viewAppointment.cancelReason }]
        : []),
      ...(viewAppointment.createdAt
        ? [
            {
              label: "Created At",
              value: new Date(viewAppointment.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
            },
          ]
        : []),
    ];
  }, [viewAppointment]);

  const columns = useMemo(() => getAppointmentColumns(), []);
  const appointments = useMemo(() => data?.data ?? [], [data?.data]);

  const handleArrive = useCallback(
    (appointment: Appointment) => {
      arriveAppointment(appointment.id);
    },
    [arriveAppointment],
  );

  const handleComplete = useCallback(
    (appointment: Appointment) => {
      completeAppointment(appointment.id);
    },
    [completeAppointment],
  );

  const handleCancelRequest = useCallback((appointment: Appointment) => {
    setCancelTarget(appointment);
  }, []);

  const handleCancelConfirm = useCallback(
    (values: CancelAppointmentInput) => {
      if (!cancelTarget) return;

      cancelAppointment(
        {
          id: cancelTarget.id,
          payload: values,
        },
        {
          onSuccess: () => {
            setCancelTarget(null);
          },
        },
      );
    },
    [cancelAppointment, cancelTarget],
  );

  const table = useReactTable({
    data: appointments,
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
      onView: (appointment: Appointment) => setViewId(appointment.id),
      onEdit: (appointment: Appointment) => navigate(`/appointments/edit/${appointment.id}`),
      onArrive: handleArrive,
      onComplete: handleComplete,
      onCancel: handleCancelRequest,
      pendingAction,
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
      <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
        <DefaultSelect
          control={filterForm.control}
          name="status"
          placeholder="Filter by status"
          options={appointmentStatusOptions.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          onChangeCallback={() => resetPagination()}
          width="100%"
        />
      </div>

      {isLoading ? (
        <DefaultTableSkeleton
          columnCount={8}
          rowCount={5}
          searchableColumnCount={0}
          showViewOptions={false}
        />
      ) : (
        <DefaultTable table={table} />
      )}

      <CancelAppointmentDialog
        appointment={cancelTarget}
        open={!!cancelTarget}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null);
        }}
        onConfirm={handleCancelConfirm}
        isPending={isCancelling}
      />

      <ViewDetailModal
        open={!!viewId}
        onOpenChange={(open) => {
          if (!open) setViewId(null);
        }}
        title="Appointment Details"
        fields={
          isViewLoading
            ? [{ label: "Loading", value: <Skeleton className="h-4 w-40" /> }]
            : viewFields
        }
      />
    </div>
  );
}

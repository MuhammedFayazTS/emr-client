import { Loader } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { Appointment } from "../types/appointment.types";
import {
  canArriveAppointment,
  canCancelAppointment,
  canCompleteAppointment,
} from "../utils/appointment.utils";
import { useHasPermission } from "@/shared/hooks/useHasPermission";
import { PERMISSIONS } from "@/shared/constants/permissions";

export type WorkflowAction = "arrive" | "complete" | "cancel";

interface AppointmentWorkflowActionsProps {
  appointment: Appointment;
  pendingAction?: { id: string; type: WorkflowAction };
  onArrive: (appointment: Appointment) => void;
  onComplete: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
}

export function AppointmentWorkflowActions({
  appointment,
  pendingAction,
  onArrive,
  onComplete,
  onCancel,
}: AppointmentWorkflowActionsProps) {
  const canArrive = useHasPermission(PERMISSIONS.APPOINTMENT.ARRIVE);
  const canComplete = useHasPermission(PERMISSIONS.APPOINTMENT.UPDATE);
  const canCancel = useHasPermission(PERMISSIONS.APPOINTMENT.CANCEL);

  const showArrive = canArrive && canArriveAppointment(appointment.status);
  const showComplete = canComplete && canCompleteAppointment(appointment.status);
  const showCancel = canCancel && canCancelAppointment(appointment.status);

  if (!showArrive && !showComplete && !showCancel) {
    return <span className="text-muted-foreground text-xs">—</span>;
  }

  const isPending = (type: WorkflowAction) =>
    pendingAction?.id === appointment.id && pendingAction.type === type;

  return (
    <div className="flex flex-wrap gap-1">
      {showArrive && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!!pendingAction}
          onClick={() => onArrive(appointment)}
        >
          {isPending("arrive") ? <Loader className="size-3.5 animate-spin" /> : "Arrive"}
        </Button>
      )}

      {showComplete && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!!pendingAction}
          onClick={() => onComplete(appointment)}
        >
          {isPending("complete") ? <Loader className="size-3.5 animate-spin" /> : "Complete"}
        </Button>
      )}

      {showCancel && (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={!!pendingAction}
          onClick={() => onCancel(appointment)}
        >
          {isPending("cancel") ? <Loader className="size-3.5 animate-spin" /> : "Cancel"}
        </Button>
      )}
    </div>
  );
}

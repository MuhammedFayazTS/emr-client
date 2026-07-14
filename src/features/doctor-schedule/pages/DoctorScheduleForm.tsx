import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import { FieldGroup, Field, FieldLabel } from "@/shared/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import DefaultTextInput from "@/shared/components/core/DefaultTextInput";
import { DefaultSelect } from "@/shared/components/core/DefaultSelect";
import DefaultSwitchInput from "@/shared/components/core/DefaultSwitchInput";
import { WeeklyScheduleEditor } from "@/shared/components/core/WeeklyScheduleEditor";
import {
  createDoctorScheduleSchema,
  type CreateDoctorScheduleFormInput,
  type CreateDoctorScheduleOutput,
} from "../validation/doctorSchedule.schema";
import {
  useCreateDoctorSchedule,
  useUpdateDoctorSchedule,
} from "../hooks/useDoctorScheduleMutations";
import { useGetDoctorSchedule } from "../hooks/useDoctorScheduleQueries";
import { useDoctors } from "@/features/doctor/hooks/useDoctorsQueries";
import { formatOptions } from "@/shared/utils/utils";
import { DayOfWeek } from "@/shared/constants/days";

const emptyWeek = Object.values(DayOfWeek).map((day) => ({
  dayOfWeek: day,
  isWorking: false,
  sessions: [] as { startTime: string; endTime: string }[],
}));

export default function DoctorScheduleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const {
    mutate: createSchedule,
    isPending: isCreatePending,
    error: createError,
  } = useCreateDoctorSchedule();
  const {
    mutate: updateSchedule,
    isPending: isUpdatePending,
    error: updateError,
  } = useUpdateDoctorSchedule();
  const { data: scheduleData, isLoading: isScheduleLoading } = useGetDoctorSchedule(id as string);
  const { data: doctorsData, isLoading: isDoctorsLoading } = useDoctors({ limit: 100 });

  const error = createError || updateError;
  const isPending = isCreatePending || isUpdatePending;

  const doctorOptions = useMemo(() => formatOptions(doctorsData?.data || []), [doctorsData]);

  const form = useForm<CreateDoctorScheduleFormInput>({
    resolver: zodResolver(createDoctorScheduleSchema),
    defaultValues: {
      doctorId: "",
      slotDuration: 30,
      workingDays: emptyWeek,
      isActive: true,
    },
  });

  const onSubmit = (payload: CreateDoctorScheduleOutput) => {
    if (isEdit) {
      updateSchedule(
        { id: id as string, payload },
        {
          onSuccess: () => navigate("/doctor-schedules"),
        },
      );
    } else {
      createSchedule(payload, {
        onSuccess: () => navigate("/doctor-schedules"),
      });
    }
  };

  useEffect(() => {
    if (isEdit && scheduleData) {
      const doctorId = scheduleData.doctorId._id;

      // Merge server days with the full 7-day template so missing days still render
      const mergedWeek = emptyWeek.map((defaultDay) => {
        const match = scheduleData.workingDays?.find((d) => d.dayOfWeek === defaultDay.dayOfWeek);
        return match ?? defaultDay;
      });

      form.reset({
        doctorId,
        slotDuration: scheduleData.slotDuration,
        workingDays: mergedWeek,
        isActive: scheduleData.isActive,
      });
    }
  }, [isEdit, scheduleData, form]);

  const isLoading = isScheduleLoading || isDoctorsLoading;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Failed to {isEdit ? "update" : "create"} schedule</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Something went wrong. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
            <DefaultSelect
              control={form.control}
              name="doctorId"
              label="Doctor"
              placeholder="Select a doctor"
              options={doctorOptions}
              disabled={isEdit}
            />

            <DefaultTextInput
              control={form.control}
              name="slotDuration"
              label="Slot Duration (minutes)"
              type="number"
              placeholder="e.g. 30"
            />

            <Field>
              <FieldLabel className="dark:text-[#f1f7feb5] text-sm">Weekly Availability</FieldLabel>
              <WeeklyScheduleEditor control={form.control} name="workingDays" />
            </Field>

            <DefaultSwitchInput
              control={form.control}
              name="isActive"
              label="Active"
              description="Inactive schedules won't accept new appointment bookings"
            />
          </>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/doctor-schedules")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || isLoading}>
            {isEdit
              ? isPending
                ? "Updating..."
                : "Update Schedule"
              : isPending
                ? "Creating..."
                : "Create Schedule"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

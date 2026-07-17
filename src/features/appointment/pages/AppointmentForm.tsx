import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/shared/components/ui/button";
import { FieldGroup, Field, FieldLabel } from "@/shared/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import DefaultTextInput from "@/shared/components/core/DefaultTextInput";
import DefaultTextArea from "@/shared/components/core/DefaultTextArea";
import { DefaultSelect } from "@/shared/components/core/DefaultSelect";
import DefaultDatePicker from "@/shared/components/core/DefaultDatePicker";
import { SlotGrid } from "@/shared/components/core/SlotGrid";
import {
  createAppointmentFormSchema,
  updateAppointmentSchema,
  type CreateAppointmentFormInput,
  type CreateAppointmentInput,
  type UpdateAppointmentInput,
} from "../validation/appointment.schema";
import { useCreateAppointment, useUpdateAppointment } from "../hooks/useAppointmentMutations";
import { useGetAppointment } from "../hooks/useAppointmentQueries";
import { useAvailableSlots } from "../hooks/useAvailableSlots";
import { usePatients } from "@/features/patient/hooks/usePatientQueries";
import { useDoctors } from "@/features/doctor/hooks/useDoctorsQueries";
import { useGetDepartments } from "@/features/department/hooks/useDepartmentsQueries";
import { formatOptions } from "@/shared/utils/utils";
import { formatAppointmentDate, resolveEntityLabel } from "../utils/appointment.utils";

export default function AppointmentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const {
    mutate: createAppointment,
    isPending: isCreatePending,
    error: createError,
  } = useCreateAppointment();
  const {
    mutate: updateAppointment,
    isPending: isUpdatePending,
    error: updateError,
  } = useUpdateAppointment();
  const { data: appointmentData, isLoading: isAppointmentLoading } = useGetAppointment(
    id as string,
  );

  const { data: patientsData, isLoading: isPatientsLoading } = usePatients({
    limit: 100,
    isActive: true,
  });
  const { data: doctorsData, isLoading: isDoctorsLoading } = useDoctors({ limit: 100 });
  const { data: departmentsData, isLoading: isDepartmentsLoading } = useGetDepartments({
    limit: 100,
  });

  const error = createError || updateError;
  const isPending = isCreatePending || isUpdatePending;

  const patientOptions = useMemo(
    () =>
      patientsData?.data?.map((patient) => ({
        label: `${patient.firstName} ${patient.lastName}`,
        value: patient.id,
      })) ?? [],
    [patientsData],
  );

  const doctorOptions = useMemo(() => formatOptions(doctorsData?.data || []), [doctorsData]);

  const departmentOptions = useMemo(
    () => formatOptions(departmentsData?.data || []),
    [departmentsData],
  );

  const createForm = useForm<CreateAppointmentFormInput>({
    resolver: zodResolver(createAppointmentFormSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      departmentId: "",
      purpose: "",
      notes: "",
    },
  });

  const updateForm = useForm<UpdateAppointmentInput>({
    resolver: zodResolver(updateAppointmentSchema),
    defaultValues: {
      purpose: "",
      notes: "",
    },
  });

  const selectedDoctorId = createForm.watch("doctorId");
  const selectedDate = createForm.watch("date");
  const dateParam = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  const { data: groupedSlots, isLoading: isSlotsLoading } = useAvailableSlots(
    selectedDoctorId,
    dateParam,
  );

  useEffect(() => {
    if (!isEdit && selectedDoctorId && doctorsData?.data) {
      const doctor = doctorsData.data.find((item) => item.id === selectedDoctorId);
      const departmentId = doctor?.department?.id ?? doctor?.department?._id;
      if (departmentId) {
        createForm.setValue("departmentId", departmentId);
      }
    }
  }, [isEdit, selectedDoctorId, doctorsData, createForm]);

  useEffect(() => {
    createForm.resetField("slot");
  }, [selectedDoctorId, dateParam, createForm]);

  useEffect(() => {
    if (isEdit && appointmentData) {
      updateForm.reset({
        purpose: appointmentData.purpose ?? "",
        notes: appointmentData.notes ?? "",
      });
    }
  }, [isEdit, appointmentData, updateForm]);

  const onCreateSubmit = (values: CreateAppointmentFormInput) => {
    if (!values.slot) return;

    const payload: CreateAppointmentInput = {
      patientId: values.patientId,
      doctorId: values.doctorId,
      departmentId: values.departmentId,
      date: format(values.date, "yyyy-MM-dd"),
      startTime: values.slot.startTime,
      endTime: values.slot.endTime,
      purpose: values.purpose || undefined,
      notes: values.notes || undefined,
    };

    createAppointment(payload, {
      onSuccess: () => navigate("/appointments"),
    });
  };

  const onUpdateSubmit = (values: UpdateAppointmentInput) => {
    updateAppointment(
      {
        id: id as string,
        payload: {
          purpose: values.purpose || undefined,
          notes: values.notes || undefined,
        },
      },
      {
        onSuccess: () => navigate("/appointments"),
      },
    );
  };

  const isReferenceDataLoading = isPatientsLoading || isDoctorsLoading || isDepartmentsLoading;
  const isLoading = isEdit ? isAppointmentLoading : isReferenceDataLoading;

  if (isEdit) {
    return (
      <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} noValidate>
        <FieldGroup>
          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Failed to update appointment</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : "Something went wrong. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <Skeleton className="h-32" />
          ) : (
            <>
              <div className="rounded-lg border p-4 space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Appointment #:</span>{" "}
                  {appointmentData?.appointmentNumber}
                </p>
                <p>
                  <span className="text-muted-foreground">Patient:</span>{" "}
                  {resolveEntityLabel(appointmentData?.patientId ?? "—")}
                </p>
                <p>
                  <span className="text-muted-foreground">Doctor:</span>{" "}
                  {resolveEntityLabel(appointmentData?.doctorId ?? "—")}
                </p>
                <p>
                  <span className="text-muted-foreground">Department:</span>{" "}
                  {resolveEntityLabel(appointmentData?.departmentId ?? "—")}
                </p>
                <p>
                  <span className="text-muted-foreground">Date:</span>{" "}
                  {appointmentData?.date ? formatAppointmentDate(appointmentData.date) : "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Time:</span>{" "}
                  {appointmentData
                    ? `${appointmentData.startTime} – ${appointmentData.endTime}`
                    : "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Status:</span>{" "}
                  {appointmentData?.status ?? "—"}
                </p>
              </div>

              <DefaultTextInput
                control={updateForm.control}
                name="purpose"
                label="Purpose"
                placeholder="Reason for visit"
                autoComplete="off"
              />

              <DefaultTextArea
                control={updateForm.control}
                name="notes"
                label="Notes"
                placeholder="Additional notes"
              />
            </>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/appointments")}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isLoading}>
              {isPending ? "Updating..." : "Update Appointment"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    );
  }

  return (
    <form onSubmit={createForm.handleSubmit(onCreateSubmit)} noValidate>
      <FieldGroup>
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Failed to create appointment</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Something went wrong. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <>
            <DefaultSelect
              control={createForm.control}
              name="patientId"
              label="Patient"
              placeholder="Select a patient"
              options={patientOptions}
            />

            <DefaultSelect
              control={createForm.control}
              name="doctorId"
              label="Doctor"
              placeholder="Select a doctor"
              options={doctorOptions}
            />

            <DefaultSelect
              control={createForm.control}
              name="departmentId"
              label="Department"
              placeholder="Select a department"
              options={departmentOptions}
            />

            <DefaultDatePicker
              control={createForm.control}
              name="date"
              label="Appointment Date"
              placeholder="Pick a date"
              startMonth={new Date()}
            />

            <Field>
              <FieldLabel className="dark:text-[#f1f7feb5] text-sm">Available Slots</FieldLabel>
              {!selectedDoctorId || !selectedDate ? (
                <p className="text-sm text-muted-foreground py-4">
                  Select a doctor and date to view available slots.
                </p>
              ) : (
                <SlotGrid
                  control={createForm.control}
                  name="slot"
                  groupedSlots={groupedSlots ?? {}}
                  isLoading={isSlotsLoading}
                />
              )}
            </Field>

            <DefaultTextInput
              control={createForm.control}
              name="purpose"
              label="Purpose"
              placeholder="Reason for visit"
              autoComplete="off"
            />

            <DefaultTextArea
              control={createForm.control}
              name="notes"
              label="Notes"
              placeholder="Additional notes"
            />
          </>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/appointments")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || isLoading}>
            {isPending ? "Creating..." : "Create Appointment"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

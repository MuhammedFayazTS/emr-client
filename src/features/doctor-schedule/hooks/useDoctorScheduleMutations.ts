import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorScheduleApi } from "../api/doctorSchedule.api";
import { doctorScheduleKeys } from "../api/doctorSchedule.keys";
import type { DoctorSchedule, CreateDoctorSchedulePayload } from "../types/doctorSchedule.types";
import type { ApiError } from "@/shared/api/types";
import { notify } from "@/shared/utils/notify";

export function useCreateDoctorSchedule() {
  const queryClient = useQueryClient();
  return useMutation<DoctorSchedule, ApiError, CreateDoctorSchedulePayload>({
    mutationFn: doctorScheduleApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: doctorScheduleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: doctorScheduleKeys.byDoctor(data.doctorId.id) });
      notify.created("Schedule");
    },
    onError: (error) => {
      notify.error(error, "Failed to create schedule");
    },
  });
}

export function useUpdateDoctorSchedule() {
  const queryClient = useQueryClient();
  return useMutation<
    DoctorSchedule,
    ApiError,
    { id: string; payload: CreateDoctorSchedulePayload }
  >({
    mutationFn: doctorScheduleApi.update,
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: doctorScheduleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: doctorScheduleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: doctorScheduleKeys.byDoctor(data.doctorId.id) });
      notify.updated("Schedule");
    },
    onError: (error) => {
      notify.error(error, "Failed to update schedule");
    },
  });
}

export function useDeleteDoctorSchedule() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: doctorScheduleApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorScheduleKeys.lists() });
      notify.deleted("Schedule");
    },
    onError: (error) => {
      notify.error(error, "Failed to delete schedule");
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { receptionistApi } from "../api/receptionist.api";
import { receptionistKeys } from "../api/receptionist.keys";
import { notify } from "@/shared/utils/notify";

export function useCreateReceptionist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: receptionistApi.create,
    onSuccess: () => {
      notify.success("Receptionist created successfully");
      queryClient.invalidateQueries({ queryKey: receptionistKeys.lists() });
    },
    onError: (error) => {
      notify.error(error, "Failed to create receptionist");
    },
  });
}

export function useUpdateReceptionist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: receptionistApi.update,
    onSuccess: (_, variables) => {
      notify.success("Receptionist updated successfully");
      queryClient.invalidateQueries({ queryKey: receptionistKeys.lists() });
      queryClient.invalidateQueries({ queryKey: receptionistKeys.detail(variables.id) });
    },
    onError: (error) => {
      notify.error(error, "Failed to update receptionist");
    },
  });
}

export function useDeleteReceptionist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: receptionistApi.delete,
    onSuccess: () => {
      notify.success("Receptionist deleted successfully");
      queryClient.invalidateQueries({ queryKey: receptionistKeys.lists() });
    },
    onError: (error) => {
      notify.error(error, "Failed to delete receptionist");
    },
  });
}

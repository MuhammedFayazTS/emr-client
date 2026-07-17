import type { ReceptionistFilters } from "../types/receptionist.types";

export const receptionistKeys = {
  all: ["receptionists"] as const,
  lists: () => [...receptionistKeys.all, "list"] as const,
  list: (filters: ReceptionistFilters) => [...receptionistKeys.lists(), { filters }] as const,
  details: () => [...receptionistKeys.all, "detail"] as const,
  detail: (id: string) => [...receptionistKeys.details(), id] as const,
};

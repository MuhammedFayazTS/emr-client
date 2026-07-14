import { useQuery } from "@tanstack/react-query";
import { departmentApi } from "../api/department.api";
import { departmentKeys } from "../api/department.keys";
import type { DepartmentFilters } from "../types/department.types";

export function useGetDepartments(filters: DepartmentFilters = {}) {
  return useQuery({
    queryKey: departmentKeys.list(filters),
    queryFn: () => departmentApi.getList(filters),
  });
}

export function useGetDepartment(id: string) {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: () => departmentApi.getOne(id),
    enabled: !!id,
  });
}

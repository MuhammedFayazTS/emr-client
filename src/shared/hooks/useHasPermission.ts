import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import type { Permission } from "../constants/permissions";

export function useHasPermission(required?: Permission | Permission[]): boolean {
  const { data: user } = useCurrentUser();
  if (!required) return true; // no permission required = always allowed
  if (!user) return false;
  const permissions = Array.isArray(required) ? required : [required];
  return permissions.some((permission) => user.permissions.includes(permission));
}
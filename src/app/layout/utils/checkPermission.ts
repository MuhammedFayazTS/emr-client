import type { User } from "@/features/auth/types/auth.types";
import type { SidebarMenuItemType } from "../config/sidebar-menu.config";

// Permission checker for menu/route authorization
export function checkPermission(user: User | undefined, item: SidebarMenuItemType): boolean {
  if (!item.requiredPermissions || item.requiredPermissions.length === 0) return true;
  if (!user) return false;
  return item.requiredPermissions.some((permission) => user.permissions.includes(permission));
}

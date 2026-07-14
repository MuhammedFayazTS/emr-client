import { Link, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/shared/components/ui/sidebar";
import { sidebarMenuItems } from "../config/sidebar-menu.config";
import { checkPermission } from "../utils/checkPermission";
import type { User } from "@/features/auth/types/auth.types";

interface SidebarNavMenuProps {
  user: User | undefined;
}

export function SidebarNavMenu({ user }: SidebarNavMenuProps) {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {sidebarMenuItems.map((item) => {
            const isAllowed = checkPermission(user, item);
            if (!isAllowed) return null;

            const isActive = location.pathname === item.path;

            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  render={<Link to={item.path} />}
                  isActive={isActive}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground font-medium shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

import { Sidebar, SidebarContent, SidebarHeader, useSidebar } from "@/shared/components/ui/sidebar";
import { SidebarNavMenu } from "./SidebarNavMenu";
import { SidebarUserFooter } from "./SidebarUserFooter";
import type { User } from "@/features/auth/types/auth.types";

interface AppSidebarProps {
  user: User | undefined;
  onLogout: () => void;
}

export function AppSidebar({ user, onLogout }: AppSidebarProps) {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="h-16 flex items-center justify-between px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            E
          </div>
          {open && <span className="font-semibold text-lg tracking-tight">EMR Portal</span>}
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarNavMenu user={user} />
      </SidebarContent>

      <SidebarUserFooter user={user} onLogout={onLogout} />
    </Sidebar>
  );
}

import { Outlet, useNavigate } from "react-router-dom"
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser"
import { useLogout } from "@/features/auth/hooks/useLogout"
import { SidebarProvider, SidebarInset } from "@/shared/components/ui/sidebar"
import { AppSidebar } from "./components/AppSidebar"
import { AppHeader } from "./components/AppHeader"

export default function AppLayout() {
  const { data: user } = useCurrentUser();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => navigate("/login"),
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar user={user} onLogout={handleLogout} />

        <SidebarInset className="flex flex-col flex-1 min-w-0">
          <AppHeader />

          <main className="flex-1 overflow-auto bg-muted/30 p-3">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
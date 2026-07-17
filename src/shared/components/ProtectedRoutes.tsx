import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";

export function ProtectedRoutes() {
  const { data: user, isLoading } = useCurrentUser();
  if (isLoading) return <AuthLoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

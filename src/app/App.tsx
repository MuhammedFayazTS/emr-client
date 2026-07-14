import { authKeys } from "@/features/auth/api/auth.keys";
import { setSessionExpiredHandler } from "@/shared/api/axiosInstance";
import { RouteLoader } from "@/shared/components/RouteLoader";
import { useQueryClient } from "@tanstack/react-query";
import { Suspense, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // instead of importing the singleton

  useEffect(() => {
    setSessionExpiredHandler(() => {
      queryClient.setQueryData(authKeys.currentUser(), null);
      navigate("/login", { replace: true });
    });
  }, [navigate, queryClient]);

  return (
    <Suspense fallback={<RouteLoader />}>
      <Outlet />
    </Suspense>
  );
}

export default App;

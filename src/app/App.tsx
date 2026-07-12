import { Routes, Route, useNavigate } from "react-router-dom"
import AuthRoutes from "@/app/routers/AuthRoutes"
import AppRoutes from "./routers/AppRoutes"
import { ProtectedRoutes } from "@/shared/components/ProtectedRoutes"
import { PublicRoutes } from "@/shared/components/PublicRoutes"
import { RouteLoader } from "@/shared/components/RouteLoader"
import { Suspense, useEffect } from "react"
import { setSessionExpiredHandler } from "@/shared/api/axiosInstance"
import { queryClient } from "@/shared/api/queryClient"
import { authKeys } from "@/features/auth/api/auth.keys"

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setSessionExpiredHandler(() => {
      queryClient.setQueryData(authKeys.currentUser(), null);
      navigate("/login", { replace: true });
    });
  }, [navigate, queryClient]);

  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route element={<PublicRoutes />}>
          {AuthRoutes()}
        </Route>

        <Route element={<ProtectedRoutes />}>
          {AppRoutes()}
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
import { Routes, Route } from "react-router-dom"
import AuthRoutes from "@/app/routers/AuthRoutes"
import AppRoutes from "./routers/AppRoutes"
import { ProtectedRoutes } from "@/shared/components/ProtectedRoutes"
import { PublicRoutes } from "@/shared/components/PublicRoutes"
import { RouteLoader } from "@/shared/components/RouteLoader"
import { Suspense } from "react"

function App() {
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
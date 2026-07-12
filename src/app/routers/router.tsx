import { createBrowserRouter } from "react-router-dom"
import { ProtectedRoutes } from "@/shared/components/ProtectedRoutes"
import { PublicRoutes } from "@/shared/components/PublicRoutes"
import { authRoutes } from "@/app/routers/auth.routes"
import { appRoutes } from "@/app/routers/app.routes"
import App from "@/app/App"

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <PublicRoutes />,
        children: authRoutes,
      },
      {
        element: <ProtectedRoutes />,
        children: appRoutes,
      },
    ],
  },
])
import { lazy } from "react"
import type { RouteObject } from "react-router-dom"

const AppointmentPage = lazy(() => import("../pages/AppointmentPage"))
const AppointmentList = lazy(() => import("../pages/AppointmentList"))
const AppointmentForm = lazy(() => import("../pages/AppointmentForm"))

export const appointmentRoutes: RouteObject[] = [
    {
        path: "appointments",
        element: <AppointmentPage />,
        children: [
            { index: true, element: <AppointmentList /> },
            { path: "create", element: <AppointmentForm /> },
            { path: "edit/:id", element: <AppointmentForm /> },
        ],
    },
]

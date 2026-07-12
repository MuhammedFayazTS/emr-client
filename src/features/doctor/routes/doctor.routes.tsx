import { lazy } from "react"
import type { RouteObject } from "react-router-dom"

const DoctorPage = lazy(() => import("../pages/DoctorPage"))
const DoctorList = lazy(() => import("../pages/DoctorList"))
const DoctorForm = lazy(() => import("../pages/DoctorForm"))

export const doctorRoutes: RouteObject[] = [
    {
        path: "doctors",
        element: <DoctorPage />,
        children: [
            { index: true, element: <DoctorList /> },
            { path: "create", element: <DoctorForm /> },
            { path: "edit/:id", element: <DoctorForm /> },
        ],
    },
]

export default doctorRoutes

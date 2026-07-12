import { Navigate } from "react-router-dom"
import type { RouteObject } from "react-router-dom"
import AppLayout from "../layout/AppLayout"
import { departmentRoutes } from "@/features/department/routes/department.routes"
import { doctorRoutes } from "@/features/doctor/routes/doctor.routes"
import { patientRoutes } from "@/features/patient/routes/patient.routes"
import { receptionistRoutes } from "@/features/receptionist/routes/receptionist.routes"
import { doctorScheduleRoutes } from "@/features/doctor-schedule/routes/doctorSchedule.routes"

const Dashboard = () => <div className="p-6">Dashboard Page Content</div>

export const appRoutes: RouteObject[] = [
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { path: "dashboard", element: <Dashboard /> },
            ...departmentRoutes,
            ...doctorRoutes,
            ...receptionistRoutes,
            ...patientRoutes,
            ...doctorScheduleRoutes,
            { index: true, element: <Navigate to="dashboard" replace /> },
            { path: "*", element: <Navigate to="dashboard" replace /> },
        ],
    },
]

export default appRoutes
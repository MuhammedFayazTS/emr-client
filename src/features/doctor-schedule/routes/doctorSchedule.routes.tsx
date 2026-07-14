import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const DoctorSchedulePage = lazy(() => import("../pages/DoctorSchedulePage"));
const DoctorScheduleList = lazy(() => import("../pages/DoctorScheduleList"));
const DoctorScheduleForm = lazy(() => import("../pages/DoctorScheduleForm"));

export const doctorScheduleRoutes: RouteObject[] = [
  {
    path: "doctor-schedules",
    element: <DoctorSchedulePage />,
    children: [
      { index: true, element: <DoctorScheduleList /> },
      { path: "create", element: <DoctorScheduleForm /> },
      { path: "edit/:id", element: <DoctorScheduleForm /> },
    ],
  },
];

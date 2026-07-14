import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const PatientPage = lazy(() => import("../pages/PatientPage"));
const PatientList = lazy(() => import("../pages/PatientList"));
const PatientForm = lazy(() => import("../pages/PatientForm"));

export const patientRoutes: RouteObject[] = [
  {
    path: "patients",
    element: <PatientPage />,
    children: [
      { index: true, element: <PatientList /> },
      { path: "create", element: <PatientForm /> },
      { path: "edit/:id", element: <PatientForm /> },
    ],
  },
];

export default patientRoutes;

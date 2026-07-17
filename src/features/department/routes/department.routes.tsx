import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const DepartmentPage = lazy(() => import("../pages/DepartmentPage"));
const DepartmentList = lazy(() => import("../pages/DepartmentList"));
const DepartmentForm = lazy(() => import("../pages/DepartmentForm"));

export const departmentRoutes: RouteObject[] = [
  {
    path: "departments",
    element: <DepartmentPage />,
    children: [
      { index: true, element: <DepartmentList /> },
      { path: "create", element: <DepartmentForm /> },
      { path: "edit/:id", element: <DepartmentForm /> },
    ],
  },
];

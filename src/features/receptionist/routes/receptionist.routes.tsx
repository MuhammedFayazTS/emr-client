import { lazy } from "react"
import type { RouteObject } from "react-router-dom"

const ReceptionistPage = lazy(() => import("../pages/ReceptionistPage"))
const ReceptionistList = lazy(() => import("../pages/ReceptionistList"))
const ReceptionistForm = lazy(() => import("../pages/ReceptionistForm"))

export const receptionistRoutes: RouteObject[] = [
    {
        path: "receptionists",
        element: <ReceptionistPage />,
        children: [
            { index: true, element: <ReceptionistList /> },
            { path: "create", element: <ReceptionistForm /> },
            { path: "edit/:id", element: <ReceptionistForm /> },
        ],
    },
]


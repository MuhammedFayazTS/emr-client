import { Outlet } from "react-router-dom"
import { PageContainer } from "@/shared/components/PageContainer"
import { PERMISSIONS } from "@/shared/constants/permissions"

export default function AppointmentPage() {
    return (
        <PageContainer
            title="Appointments"
            description="Manage doctor appointments"
            createPath="/appointments/create"
            createPermission={PERMISSIONS.APPOINTMENT.CREATE}
            listPath="/appointments"
            listPermission={PERMISSIONS.APPOINTMENT.VIEW}
        >
            <Outlet />
        </PageContainer>
    )
}
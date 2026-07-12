import { Outlet } from "react-router-dom"
import { PageContainer } from "@/shared/components/PageContainer"
import { PERMISSIONS } from "@/shared/constants/permissions"

export default function DoctorSchedulePage() {
    return (
        <PageContainer
            title="Doctor Schedules"
            description="Manage doctor weekly availability"
            createPath="/doctor-schedules/create"
            createPermission={PERMISSIONS.SCHEDULE.CREATE}
            listPath="/doctor-schedules"
            listPermission={PERMISSIONS.SCHEDULE.VIEW}
        >
            <Outlet />
        </PageContainer>
    )
}
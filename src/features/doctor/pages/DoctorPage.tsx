import { Outlet } from "react-router-dom"
import { PageContainer } from "@/shared/components/PageContainer"
import { PERMISSIONS } from "@/shared/constants/permissions"

export default function DoctorPage() {
    return (
        <PageContainer
            title="Doctors"
            description="Manage hospital doctors"
            createPath="/doctors/create"
            createPermission={PERMISSIONS.DOCTOR.CREATE}
            listPath="/doctors"
            listPermission={PERMISSIONS.DOCTOR.VIEW}
        >
            <Outlet />
        </PageContainer>
    )
}

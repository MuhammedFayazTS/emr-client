import { Outlet } from "react-router-dom"
import { PageContainer } from "@/shared/components/PageContainer"
import { PERMISSIONS } from "@/shared/constants/permissions"

export default function PatientPage() {
    return (
        <PageContainer
            title="Patients"
            description="Manage hospital patients"
            createPath="/patients/create"
            createPermission={PERMISSIONS.PATIENT.CREATE}
            listPath="/patients"
            listPermission={PERMISSIONS.PATIENT.VIEW}
        >
            <Outlet />
        </PageContainer>
    )
}

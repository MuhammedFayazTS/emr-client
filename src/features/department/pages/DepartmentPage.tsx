import { Outlet } from "react-router-dom"
import { PageContainer } from "@/shared/components/PageContainer"
import { PERMISSIONS } from "@/shared/constants/permissions"

export default function DepartmentPage() {
    return (
        <PageContainer
            title="Departments"
            description="Manage hospital departments"
            createPath="/departments/create"
            createPermission={PERMISSIONS.DEPARTMENT.CREATE}
            listPath="/departments"
            listPermission={PERMISSIONS.DEPARTMENT.VIEW}
        >
            <Outlet />
        </PageContainer>
    )
}
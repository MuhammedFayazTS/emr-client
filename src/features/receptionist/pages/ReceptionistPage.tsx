import { Outlet } from "react-router-dom";
import { PageContainer } from "@/shared/components/PageContainer";
import { PERMISSIONS } from "@/shared/constants/permissions";

export default function ReceptionistPage() {
  return (
    <PageContainer
      title="Receptionists"
      description="Manage hospital receptionists"
      createPath="/receptionists/create"
      createPermission={PERMISSIONS.RECEPTIONIST.CREATE}
      listPath="/receptionists"
      listPermission={PERMISSIONS.RECEPTIONIST.VIEW}
    >
      <Outlet />
    </PageContainer>
  );
}

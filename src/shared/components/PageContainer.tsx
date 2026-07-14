import { Link } from "react-router-dom";
import { Plus, List as ListIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import type { Permission } from "@/shared/constants/permissions";
import { useHasPermission } from "../hooks/useHasPermission";

interface PageContainerProps {
  /** Page heading shown in the card header */
  title: string;
  /** Short supporting text under the title */
  description?: string;

  /** Route to navigate to for the create action. Create is always required. */
  createPath: string;
  /** Permission required to see/use the Create button */
  createPermission: Permission;

  /** Route to navigate to for the list view. List button is optional. */
  listPath?: string;
  /** Permission required to see the List button — module's VIEW permission */
  listPermission?: Permission;

  /** Rendered content — pass <Outlet /> from the calling page for route-based views */
  children: React.ReactNode;
}

export function PageContainer({
  title,
  description,
  createPath,
  createPermission,
  listPath,
  listPermission,
  children,
}: PageContainerProps) {
  const canCreate = useHasPermission(createPermission);
  const canViewList = useHasPermission(listPermission);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {listPath && canViewList && (
            <Button
              variant="outline"
              size="sm"
              render={
                <Link to={listPath}>
                  <ListIcon className="mr-2 h-4 w-4" />
                  List
                </Link>
              }
            ></Button>
          )}

          {canCreate && (
            <Button
              size="sm"
              render={
                <Link to={createPath}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create
                </Link>
              }
            ></Button>
          )}
        </div>
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  );
}

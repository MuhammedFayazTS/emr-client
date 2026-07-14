import { PERMISSIONS, type Permission } from "@/shared/constants/permissions";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  UserCog,
  Building2,
  History,
} from "lucide-react";
import type { ComponentType } from "react";

export interface SidebarMenuItemType {
  title: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
  requiredPermissions?: Permission[];
}

export const sidebarMenuItems: SidebarMenuItemType[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    requiredPermissions: [PERMISSIONS.DASHBOARD.VIEW],
  },
  {
    title: "Appointments",
    path: "/appointments",
    icon: Calendar,
    requiredPermissions: [PERMISSIONS.APPOINTMENT.VIEW],
  },
  {
    title: "Patients",
    path: "/patients",
    icon: Users,
    requiredPermissions: [PERMISSIONS.PATIENT.VIEW],
  },
  {
    title: "Doctors",
    path: "/doctors",
    icon: Stethoscope,
    requiredPermissions: [PERMISSIONS.DOCTOR.VIEW],
  },
  {
    title: "Doctors Schedule",
    path: "/doctor-schedules",
    icon: Stethoscope,
    // TODO: add permission of doctor schedule
    requiredPermissions: [PERMISSIONS.DOCTOR.VIEW],
  },
  {
    title: "Receptionists",
    path: "/receptionists",
    icon: UserCog,
    requiredPermissions: [PERMISSIONS.RECEPTIONIST.VIEW],
  },
  {
    title: "Departments",
    path: "/departments",
    icon: Building2,
    requiredPermissions: [PERMISSIONS.DEPARTMENT.VIEW],
  },
  {
    title: "Audit Log",
    path: "/audit",
    icon: History,
    requiredPermissions: [PERMISSIONS.AUDIT.VIEW],
  },
];

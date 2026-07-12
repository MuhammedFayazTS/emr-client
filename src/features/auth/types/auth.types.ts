import type { Permission } from "@/shared/constants/permissions";

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'staff' | 'customer';
    permissions: Permission[];
}

export interface LoginResponse {
    user: User;
}
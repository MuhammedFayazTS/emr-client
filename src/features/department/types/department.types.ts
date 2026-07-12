export interface Department {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
}

export interface DepartmentFilters {
    search?: string;
    cursor?: string;
    limit?: number;
}

export interface CreateDepartmentPayload {
    name: string;
    description?: string;
}
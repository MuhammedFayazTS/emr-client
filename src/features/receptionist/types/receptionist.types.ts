export interface Receptionist {
    id: string;
    name: string;
    email: string;
    phone: string;
    assignedDesk?: string;
    isActive: boolean;
    createdAt: string;
}

export interface ReceptionistFilters {
    search?: string;
    cursor?: string;
    limit?: number;
}

export interface CreateReceptionistPayload {
    name: string;
    email: string;
    password?: string;
    phone: string;
    assignedDesk?: string;
}

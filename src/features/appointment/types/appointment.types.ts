export enum AppointmentStatus {
    SCHEDULED = "SCHEDULED",
    ARRIVED = "ARRIVED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    NO_SHOW = "NO_SHOW",
}

export interface AppointmentRef {
    id?: string;
    _id?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    patientId?: string;
}

export interface Appointment {
    id: string;
    appointmentNumber: string;
    patientId: AppointmentRef;
    doctorId: string | AppointmentRef;
    departmentId: string | AppointmentRef;
    date: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    purpose?: string;
    notes?: string;
    cancelledAt?: string;
    cancelledBy?: string;
    cancelReason?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AppointmentFilters {
    doctorId?: string;
    departmentId?: string;
    patientId?: string;
    status?: AppointmentStatus;
    dateFrom?: string;
    dateTo?: string;
    cursor?: string;
    limit?: number;
}

export interface CreateAppointmentPayload {
    patientId: string;
    doctorId: string;
    departmentId: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose?: string;
    notes?: string;
}

export interface UpdateAppointmentPayload {
    purpose?: string;
    notes?: string;
}

export interface CancelAppointmentPayload {
    cancelReason: string;
}

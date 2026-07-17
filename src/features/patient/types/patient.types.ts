export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Patient {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  gender: "Male" | "Female" | "Other" | string;
  dateOfBirth: string | Date;
  phone: string;
  email?: string;
  bloodGroup?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientFilters {
  search?: string;
  phone?: string;
  patientId?: string;
  isActive?: boolean;
  cursor?: string;
  limit?: number;
}

export interface CreatePatientPayload {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date | string;
  phone: string;
  email?: string;
  bloodGroup?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
}

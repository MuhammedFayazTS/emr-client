export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: {
    id: string;
    _id?: string; //edit case: todo keep consitency
    name: string;
  };
  specialization?: string;
  qualification?: string;
  scheduleId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface DoctorFilters {
  search?: string;
  cursor?: string;
  limit?: number;
}

export interface CreateDoctorPayload {
  name: string;
  email: string;
  password?: string;
  phone: string;
  department: string;
  specialization?: string;
  qualification?: string;
  scheduleId?: string;
}

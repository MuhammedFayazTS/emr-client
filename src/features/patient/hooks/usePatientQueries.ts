import { useQuery } from '@tanstack/react-query';
import { patientApi } from '../api/patient.api';
import { patientKeys } from '../api/patient.keys';
import type { PatientFilters } from '../types/patient.types';

export function usePatients(filters: PatientFilters = {}) {
    return useQuery({
        queryKey: patientKeys.list(filters),
        queryFn: () => patientApi.getList(filters),
    });
}

export function useGetPatient(id: string) {
    return useQuery({
        queryKey: patientKeys.detail(id),
        queryFn: () => patientApi.getOne(id),
        enabled: !!id,
    });
}

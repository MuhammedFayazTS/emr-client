import { useQuery } from '@tanstack/react-query';
import { doctorApi } from '../api/doctor.api';
import { doctorKeys } from '../api/doctor.keys';
import type { DoctorFilters } from '../types/doctor.types';

export function useDoctors(filters: DoctorFilters = {}) {
    return useQuery({
        queryKey: doctorKeys.list(filters),
        queryFn: () => doctorApi.getList(filters),
    });
}

export function useGetDoctor(id: string) {
    return useQuery({
        queryKey: doctorKeys.detail(id),
        queryFn: () => doctorApi.getOne(id),
        enabled: !!id,
    });
}

import { useQuery } from '@tanstack/react-query';
import { doctorScheduleApi } from '../api/doctorSchedule.api';
import { doctorScheduleKeys } from '../api/doctorSchedule.keys';
import type { DoctorScheduleFilters } from '../types/doctorSchedule.types';

export function useDoctorSchedules(filters: DoctorScheduleFilters = {}) {
    return useQuery({
        queryKey: doctorScheduleKeys.list(filters),
        queryFn: () => doctorScheduleApi.getList(filters),
    });
}

export function useGetDoctorSchedule(id: string) {
    return useQuery({
        queryKey: doctorScheduleKeys.detail(id),
        queryFn: () => doctorScheduleApi.getOne(id),
        enabled: !!id,
    });
}

export function useGetScheduleByDoctorId(doctorId: string) {
    return useQuery({
        queryKey: doctorScheduleKeys.byDoctor(doctorId),
        queryFn: () => doctorScheduleApi.getByDoctorId(doctorId),
        enabled: !!doctorId,
    });
}   
import { useQuery } from '@tanstack/react-query';
import { receptionistApi } from '../api/receptionist.api';
import { receptionistKeys } from '../api/receptionist.keys';
import type { ReceptionistFilters } from '../types/receptionist.types';

export function useReceptionists(filters: ReceptionistFilters = {}) {
    return useQuery({
        queryKey: receptionistKeys.list(filters),
        queryFn: () => receptionistApi.getList(filters),
    });
}

export function useGetReceptionist(id: string) {
    return useQuery({
        queryKey: receptionistKeys.detail(id),
        queryFn: () => receptionistApi.getOne(id),
        enabled: !!id,
    });
}

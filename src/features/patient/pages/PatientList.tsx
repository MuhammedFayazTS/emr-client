import React, { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';

import { Input } from '@/shared/components/ui/input';
import { DefaultTable } from '@/shared/components/core/table/DefaultTable';
import { ViewDetailModal } from '@/shared/components/core/ViewDetailModal';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Search } from 'lucide-react';

import { usePatients } from '../hooks/usePatientQueries';
import { getPatientColumns } from '../components/patientColumns';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type { Patient } from '../types/patient.types';

const PAGE_SIZE = 10;

export default function PatientList() {
    const navigate = useNavigate();

    // ── Search ──────────────────────────────────────────────
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 300);

    // ── Cursor-based pagination ─────────────────────────────
    const [currentCursor, setCurrentCursor] = useState<string | undefined>();
    const [cursorStack, setCursorStack] = useState<(string | undefined)[]>([]);
    const pageIndex = cursorStack.length;

    // ── View Modal State ────────────────────────────────────
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    // ── Queries / Mutations ─────────────────────────────────
    const {
        data,
        isLoading,
        error,
    } = usePatients({ cursor: currentCursor, limit: PAGE_SIZE, search: debouncedSearch });

    const hasNextPage = data?.pagination?.hasNextPage ?? false;

    // ── Cursor navigation helpers ───────────────────────────
    const goToNextPage = useCallback(() => {
        if (!data?.pagination?.nextCursor) return;
        setCursorStack((prev) => [...prev, currentCursor]);
        setCurrentCursor(data.pagination.nextCursor);
    }, [currentCursor, data?.pagination?.nextCursor]);

    const goToPrevPage = useCallback(() => {
        setCursorStack((prev) => {
            const newStack = [...prev];
            const prevCursor = newStack.pop();
            setCurrentCursor(prevCursor);
            return newStack;
        });
    }, []);

    // ── Handlers ────────────────────────────────────────────
    const handleView = useCallback((patient: Patient) => {
        setSelectedPatient(patient);
    }, []);

    const handleEdit = useCallback((patient: Patient) => {
        navigate(`/patients/edit/${patient.id}`);
    }, [navigate]);

    const viewDetails = useMemo(() => {
        if (!selectedPatient) return [];
        const address = selectedPatient.address 
            ? `${selectedPatient.address.line1}, ${selectedPatient.address.city}, ${selectedPatient.address.state} - ${selectedPatient.address.pincode}`
            : '-';
        
        const emergencyContact = selectedPatient.emergencyContact 
            ? `${selectedPatient.emergencyContact.name} (${selectedPatient.emergencyContact.relationship}): ${selectedPatient.emergencyContact.phone}`
            : '-';

        return [
            { label: 'Patient ID', value: selectedPatient.patientId },
            { label: 'Name', value: `${selectedPatient.firstName} ${selectedPatient.lastName}` },
            { label: 'Email', value: selectedPatient.email || '-' },
            { label: 'Phone', value: selectedPatient.phone },
            { label: 'Gender', value: selectedPatient.gender },
            { label: 'DOB', value: new Date(selectedPatient.dateOfBirth).toLocaleDateString() },
            { label: 'Blood Group', value: selectedPatient.bloodGroup || '-' },
            { label: 'Address', value: address },
            { label: 'Emergency Contact', value: emergencyContact },
            { label: 'Status', value: selectedPatient.isActive ? 'Active' : 'Inactive' },
        ];
    }, [selectedPatient]);

    // ── Columns ─────────────────────────────────────────────
    const columns = useMemo(() => getPatientColumns(), []);
    const patients = useMemo(() => data?.data ?? [], [data?.data]);

    // ── Table instance ──────────────────────────────────────
    const table = useReactTable({
        data: patients,
        columns,
        pageCount: hasNextPage ? pageIndex + 2 : pageIndex + 1,
        state: {
            pagination: { pageIndex, pageSize: PAGE_SIZE },
        },
        onPaginationChange: (updater) => {
            const prev = { pageIndex, pageSize: PAGE_SIZE };
            const next = typeof updater === 'function' ? updater(prev) : updater;
            if (next.pageIndex > prev.pageIndex) goToNextPage();
            else if (next.pageIndex < prev.pageIndex) goToPrevPage();
        },
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            onView: handleView,
            onEdit: handleEdit,
        },
    });

    // ── Error State ─────────────────────────────────────────
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error.message || 'Failed to load patients'}</AlertDescription>
            </Alert>
        );
    }

    // ── Render ──────────────────────────────────────────────
    return (
        <div className="space-y-4">
            <div className="relative max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCursorStack([]);
                        setCurrentCursor(undefined);
                    }}
                    className="pl-8 w-full"
                />
            </div>

            <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                {isLoading ? <Skeleton className="h-24" /> : <DefaultTable table={table} />}
            </div>

            <ViewDetailModal
                open={!!selectedPatient}
                onOpenChange={(open) => {
                    if (!open) setSelectedPatient(null);
                }}
                title="Patient Details"
                fields={viewDetails}
            />
        </div>
    );
}

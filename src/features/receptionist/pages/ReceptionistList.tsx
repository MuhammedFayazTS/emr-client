import React, { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';

import { Input } from '@/shared/components/ui/input';
import { DefaultTable } from '@/shared/components/core/table/DefaultTable';
import { ViewDetailModal } from '@/shared/components/core/ViewDetailModal';

import { useReceptionists } from '../hooks/useReceptionistQueries';
import { useDeleteReceptionist } from '../hooks/useReceptionistMutations';
import { getReceptionistColumns } from '../components/receptionistColumns';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type { Receptionist } from '../types/receptionist.types';
import { Skeleton } from '@/shared/components/ui/skeleton';

const PAGE_SIZE = 10;

export default function ReceptionistList() {
    const navigate = useNavigate();

    // ── Search ──────────────────────────────────────────────
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 300);

    // ── Cursor-based pagination ─────────────────────────────
    const [currentCursor, setCurrentCursor] = useState<string | undefined>();
    const [cursorStack, setCursorStack] = useState<(string | undefined)[]>([]);
    const pageIndex = cursorStack.length;

    // ── View Modal State ────────────────────────────────────
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedReceptionist, setSelectedReceptionist] = useState<Receptionist | null>(null);

    // ── Queries / Mutations ─────────────────────────────────
    const {
        data,
        isLoading,
        isError,
    } = useReceptionists({ cursor: currentCursor, limit: PAGE_SIZE, search: debouncedSearch });

    const {
        mutate: deleteReceptionist,
        isPending: isDeleting
    } = useDeleteReceptionist();

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
    const handleView = useCallback((receptionist: Receptionist) => {
        setSelectedReceptionist(receptionist);
        setViewModalOpen(true);
    }, []);

    const handleEdit = useCallback((receptionist: Receptionist) => {
        navigate(`/receptionists/edit/${receptionist.id}`);
    }, [navigate]);

    const handleDelete = useCallback((receptionist: Receptionist) => {
        if (window.confirm('Are you sure you want to delete this receptionist?')) {
            deleteReceptionist(receptionist.id);
        }
    }, [deleteReceptionist]);

    const viewDetails = useMemo(() => {
        if (!selectedReceptionist) return [];
        return [
            { label: 'Name', value: selectedReceptionist.name },
            { label: 'Email', value: selectedReceptionist.email },
            { label: 'Phone', value: selectedReceptionist.phone },
            { label: 'Assigned Desk', value: selectedReceptionist.assignedDesk || '-' },
            { label: 'Status', value: selectedReceptionist.isActive ? 'Active' : 'Inactive' },
            {
                label: 'Created At',
                value: new Date(selectedReceptionist.createdAt).toLocaleDateString(
                    'en-US',
                    { year: 'numeric', month: 'short', day: 'numeric' },
                ),
            },
        ];
    }, [selectedReceptionist]);

    // ── Columns ─────────────────────────────────────────────
    const columns = useMemo(() => getReceptionistColumns(), []);
    const receptionists = useMemo(() => data?.data ?? [], [data?.data]);

    // ── Table instance ──────────────────────────────────────
    const table = useReactTable({
        data: receptionists,
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
            onDelete: handleDelete,
        },
    });

    // ── Error State ─────────────────────────────────────────
    if (isError) {
        return (
            <div className="p-8 text-center text-red-500">
                Failed to load receptionists. Please try again.
            </div>
        );
    }

    // ── Render ──────────────────────────────────────────────
    return (
        <div className="space-y-4">
            <div className="relative max-w-sm">
                <Input
                    placeholder="Search receptionists..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCursorStack([]);
                        setCurrentCursor(undefined);
                    }}
                    className="w-full"
                />
            </div>

            <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                {isLoading ? <Skeleton className='h-24' /> : <DefaultTable table={table} />}
            </div>

            <ViewDetailModal
                open={!!selectedReceptionist}
                onOpenChange={(open) => {
                    if (!open) setSelectedReceptionist(null);
                }}
                title="Receptionist Details"
                fields={viewDetails}
            />
        </div>
    );
}

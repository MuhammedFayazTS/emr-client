import { createColumnHelper } from '@tanstack/react-table';
import type { Receptionist } from '../types/receptionist.types';
import { Button } from '@/shared/components/ui/button';
import { Pencil, Trash2, Eye } from 'lucide-react';

const columnHelper = createColumnHelper<Receptionist>();

export const getReceptionistColumns = () => [
    columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('phone', {
        header: 'Phone',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('assignedDesk', {
        header: 'Assigned Desk',
        cell: (info) => info.getValue() || <span className="text-muted-foreground">-</span>,
    }),
    columnHelper.accessor('isActive', {
        header: 'Status',
        cell: (info) => {
            const isActive = info.getValue();
            return (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isActive ? 'Active' : 'Inactive'}
                </span>
            );
        },
    }),
    columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row, table }) => {
            const receptionist = row.original;
            const meta = table.options.meta;

            return (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => meta?.onView?.(receptionist)}
                        title="View Details"
                    >
                        <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => meta?.onEdit?.(receptionist)}
                        title="Edit Receptionist"
                    >
                        <Pencil className="h-4 w-4 text-amber-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => meta?.onDelete?.(receptionist)}
                        title="Delete Receptionist"
                    >
                        <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                </div>
            );
        },
    }),
];

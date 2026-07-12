import { createColumnHelper } from '@tanstack/react-table';
import type { Patient } from '../types/patient.types';
import { Button } from '@/shared/components/ui/button';
import { Pencil, Eye } from 'lucide-react';

const columnHelper = createColumnHelper<Patient>();

export const getPatientColumns = () => [
    columnHelper.accessor('patientId', {
        header: 'Patient ID',
        cell: (info) => <span className="font-mono text-xs">{info.getValue()}</span>,
    }),
    columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
        id: 'name',
        header: 'Name',
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('phone', {
        header: 'Phone',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('gender', {
        header: 'Gender',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('dateOfBirth', {
        header: 'DOB',
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
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
            const patient = row.original;
            const meta = table.options.meta;

            return (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => meta?.onView?.(patient)}
                        title="View Details"
                    >
                        <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => meta?.onEdit?.(patient)}
                        title="Edit Patient"
                    >
                        <Pencil className="h-4 w-4 text-amber-600" />
                    </Button>
                </div>
            );
        },
    }),
];

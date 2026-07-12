import type { ColumnDef } from '@tanstack/react-table';
import type { Doctor } from '../types/doctor.types';
import { Button } from '@/shared/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function getDoctorColumns(): ColumnDef<Doctor>[] {
    return [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <span className="font-medium">{row.getValue('name')}</span>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
        },
        {
            accessorKey: 'specialization',
            header: 'Specialization',
            cell: ({ row }) => row.getValue('specialization') || '—',
        },
        {
            accessorKey: 'department',
            header: 'Department',
            cell: ({ row }) => {
                const dept = row.getValue<any>('department');
                return typeof dept === 'object' && dept ? dept.name : dept || '—';
            },
        },
        {
            id: 'actions',
            header: '',
            size: 100,
            cell: ({ row, table }) => {
                const onView = table.options.meta?.onView;
                const onDelete = table.options.meta?.onDelete;
                const doctor = row.original;
                return (
                    <div className="flex justify-end gap-1">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onView?.(doctor)}
                            aria-label="View doctor details"
                        >
                            <Eye className="size-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            render={(
                                <Link to={`/doctors/edit/${doctor.id}`} aria-label="Edit doctor">
                                    <Pencil className="size-4" />
                                </Link>
                            )}
                        >
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this doctor?')) {
                                    onDelete?.(doctor);
                                }
                            }}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            aria-label="Delete doctor"
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];
}

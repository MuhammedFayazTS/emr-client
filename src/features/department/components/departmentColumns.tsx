import type { ColumnDef } from '@tanstack/react-table';
import type { Department } from '../types/department.types';
import { TableRowActions } from '@/shared/components/core/table/DataTableRowActions';

export function getDepartmentColumns(): ColumnDef<Department>[] {
    return [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <span className="font-medium">{row.getValue('name')}</span>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Created At',
            cell: ({ row }) => {
                const date = new Date(row.getValue<string>('createdAt'));
                return (
                    <span className="text-muted-foreground">
                        {date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            header: '',
            size: 120,
            cell: ({ row, table }) => {
                const { onView, onEdit, onDelete, isDeleting } = table.options.meta ?? {};

                return (
                    <TableRowActions
                        row={row.original}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        isDeleting={isDeleting}
                    />
                );
            },
        },
    ];
}

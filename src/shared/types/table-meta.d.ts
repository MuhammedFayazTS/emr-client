import type { RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        onView?: (row: TData) => void;
        onEdit?: (row: TData) => void;
        onDelete?: (row: TData) => void;
        isDeleting?: boolean;
    }
}

// Required for TS to treat this as an ambient module augmentation file
export { };
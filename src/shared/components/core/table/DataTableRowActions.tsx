import { Eye, Loader, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface TableRowActionsProps<T> {
  row: T;
  isDeleting: boolean;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export function TableRowActions<T>({
  row,
  isDeleting,
  onView,
  onEdit,
  onDelete,
}: TableRowActionsProps<T>) {
  if (!onView && !onEdit && !onDelete) return null;

  return (
    <div className="flex justify-end gap-1">
      {onView && (
        <Button variant="ghost" size="icon-sm" onClick={() => onView(row)} aria-label="View">
          <Eye className="size-4" />
        </Button>
      )}

      {onEdit && (
        <Button variant="ghost" size="icon-sm" onClick={() => onEdit(row)} aria-label="Edit">
          <Pencil className="size-4" />
        </Button>
      )}

      {onDelete && (
        <Button
          variant="destructive"
          size="icon-sm"
          disabled={isDeleting}
          onClick={() => onDelete(row)}
          aria-label="Delete"
        >
          {isDeleting ? <Loader className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
        </Button>
      )}
    </div>
  );
}

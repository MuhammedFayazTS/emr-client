import { Button } from "@shared/components/ui/button"
import { DownloadIcon } from "lucide-react"

interface TasksTableToolbarActionsProps {
  table: unknown
}

export function DataTableToolBarActions({
  table,
}: TasksTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => console.log("first", table)}
      >
        <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  )
}
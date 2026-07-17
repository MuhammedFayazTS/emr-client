import * as React from "react";
import type { Table } from "@tanstack/react-table";
import type { DataTableFilterField } from "@/shared/types/common.types";

import { cn } from "@/shared/utils/utils";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { X } from "lucide-react";
import { DataTableFacetedFilter } from "./DataTableFactedFilters";
import { DataTableViewOptions } from "./DataTableViewOptions";

interface DataTableToolbarProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Memoize searchable and filterable columns
  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    const searchable = filterFields.filter((field) => !field.options);
    const filterable = filterFields.filter((field) => field.options);
    return { searchableColumns: searchable, filterableColumns: filterable };
  }, [filterFields]);

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between space-x-2 overflow-auto p-1",
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.map((column) =>
          table.getColumn(column.value ? String(column.value) : "") ? (
            <Input
              key={String(column.value)}
              placeholder={column.placeholder}
              value={(table.getColumn(String(column.value))?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(String(column.value))?.setFilterValue(event.target.value)
              }
              className="h-8 w-40 lg:w-64"
            />
          ) : null,
        )}
        {filterableColumns.map((column) =>
          table.getColumn(column.value ? String(column.value) : "") ? (
            <DataTableFacetedFilter
              key={String(column.value)}
              column={table.getColumn(column.value ? String(column.value) : "")}
              title={column.label}
              options={column.options ?? []}
            />
          ) : null,
        )}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X className="ml-2 size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

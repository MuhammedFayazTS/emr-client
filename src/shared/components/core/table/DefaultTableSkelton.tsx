import React from "react";
import { cn } from "@/shared/utils/utils";
import { Skeleton } from "@shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/components/ui/table";

interface DefaultTableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The number of columns in the table.
   */
  columnCount: number;

  /**
   * The number of rows in the table.
   * @default 10
   */
  rowCount?: number;

  /**
   * The number of searchable columns in the table.
   * @default 0
   */
  searchableColumnCount?: number;

  /**
   * The number of filterable columns in the table.
   * @default 0
   */
  filterableColumnCount?: number;

  /**
   * Flag to show the table view options.
   * @default true
   */
  showViewOptions?: boolean;

  /**
   * The width of each cell in the table.
   * The length of the array should be equal to the columnCount.
   * Any valid CSS width value is accepted.
   * @default ["auto"]
   */
  cellWidths?: string[];

  /**
   * Flag to show the pagination bar.
   * @default true
   */
  withPagination?: boolean;

  /**
   * Flag to prevent the table cells from shrinking.
   * @default false
   */
  shrinkZero?: boolean;
}

export function DefaultTableSkeleton({
  columnCount,
  rowCount = 10,
  searchableColumnCount = 0,
  filterableColumnCount = 0,
  showViewOptions = true,
  cellWidths = ["auto"],
  withPagination = true,
  shrinkZero = false,
  className,
  ...skeletonProps
}: DefaultTableSkeletonProps) {
  return (
    <div className={cn("w-full space-y-2.5 overflow-auto", className)} {...skeletonProps}>
      <div className="flex w-full items-center justify-between space-x-2 overflow-auto p-1">
        <div className="flex flex-1 items-center space-x-2">
          {Array.from({ length: searchableColumnCount }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-40 lg:w-60" />
          ))}
          {Array.from({ length: filterableColumnCount }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-[4.5rem] border-dashed" />
          ))}
        </div>
        {showViewOptions && <Skeleton className="ml-auto hidden h-7 w-[4.5rem] lg:flex" />}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {Array.from({ length: columnCount }).map((_, j) => (
                <TableHead
                  key={j}
                  style={{
                    width: cellWidths[j],
                    minWidth: shrinkZero ? cellWidths[j] : "auto",
                  }}
                >
                  <Skeleton className="h-6 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell
                    key={j}
                    style={{
                      width: cellWidths[j],
                      minWidth: shrinkZero ? cellWidths[j] : "auto",
                    }}
                  >
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {withPagination && (
        <div className="flex w-full items-center justify-between gap-4 overflow-auto p-1 sm:gap-8">
          <Skeleton className="h-7 w-40 shrink-0" />
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-[4.5rem]" />
            </div>
            <Skeleton className="h-7 w-20" />
            <div className="flex items-center space-x-2">
              <Skeleton className="hidden size-7 lg:block" />
              <Skeleton className="size-7" />
              <Skeleton className="size-7" />
              <Skeleton className="hidden size-7 lg:block" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

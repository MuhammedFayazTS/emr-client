import { useCallback, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { getDepartmentColumns } from "../components/departmentColumns";
import type { Department } from "../types/department.types";
import { DefaultTable } from "@/shared/components/core/table/DefaultTable";
import { DefaultTableSkeleton } from "@/shared/components/core/table/DefaultTableSkelton";
import { Input } from "@/shared/components/ui/input";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { ViewDetailModal, type ViewDetailField } from "@/shared/components/core/ViewDetailModal";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetDepartments } from "../hooks/useDepartmentsQueries";
import { useDeleteDepartment } from "../hooks/useDepartmentMutations";

const PAGE_SIZE = 10;

export default function DepartmentList() {
  const navigate = useNavigate();
  // ── Search ──────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  // ── Cursor-based pagination ─────────────────────────────
  const [currentCursor, setCurrentCursor] = useState<string | undefined>();
  const [cursorStack, setCursorStack] = useState<(string | undefined)[]>([]);
  const pageIndex = cursorStack.length;

  // ── Data fetching ───────────────────────────────────────
  const { data, isLoading, error } = useGetDepartments({
    search: debouncedSearch || undefined,
    cursor: currentCursor,
    limit: PAGE_SIZE,
  });

  const { mutate: deleteDepartment, isPending: isDeleting } = useDeleteDepartment();

  const hasNextPage = data?.pagination?.hasNextPage ?? false;

  // ── Cursor navigation helpers ───────────────────────────
  const goToNextPage = useCallback(() => {
    if (!data?.pagination?.nextCursor) return;
    setCursorStack((prev) => [...prev, currentCursor]);
    setCurrentCursor(data.pagination?.nextCursor);
  }, [currentCursor, data?.pagination?.nextCursor]);

  const goToPrevPage = useCallback(() => {
    setCursorStack((prev) => {
      const stack = [...prev];
      const prevCursor = stack.pop();
      setCurrentCursor(prevCursor);
      return stack;
    });
  }, []);

  const goToFirstPage = useCallback(() => {
    setCursorStack([]);
    setCurrentCursor(undefined);
  }, []);

  const resetPagination = useCallback(() => {
    setCursorStack([]);
    setCurrentCursor(undefined);
  }, []);

  // ── View modal ──────────────────────────────────────────
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const viewFields: ViewDetailField[] = useMemo(() => {
    if (!selectedDepartment) return [];
    return [
      { label: "Name", value: selectedDepartment.name },
      { label: "Description", value: selectedDepartment.description || "—" },
      {
        label: "Created At",
        value: new Date(selectedDepartment.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      },
    ];
  }, [selectedDepartment]);

  // ── Columns ─────────────────────────────────────────────
  const columns = useMemo(() => getDepartmentColumns(), []);
  const departments = useMemo(() => data?.data ?? [], [data?.data]);

  // ── Table instance ──────────────────────────────────────
  const table = useReactTable({
    data: departments,
    columns,
    pageCount: hasNextPage ? pageIndex + 2 : pageIndex + 1,
    state: {
      pagination: { pageIndex, pageSize: PAGE_SIZE },
    },
    onPaginationChange: (updater) => {
      const prev = { pageIndex, pageSize: PAGE_SIZE };
      const next = typeof updater === "function" ? updater(prev) : updater;

      if (next.pageIndex === 0 && pageIndex !== 0) {
        goToFirstPage();
      } else if (next.pageIndex > pageIndex) {
        goToNextPage();
      } else if (next.pageIndex < pageIndex) {
        goToPrevPage();
      }
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    meta: {
      onView: (dept: Department) => setSelectedDepartment(dept),
      onEdit: (dept: Department) => navigate(`/departments/edit/${dept.id}`),
      onDelete: (dept: Department) => deleteDepartment(dept.id),
      isDeleting,
    },
  });

  // ── Error state ─────────────────────────────────────────
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search departments..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            resetPagination();
          }}
          className="pl-8"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <DefaultTableSkeleton
          columnCount={3}
          rowCount={5}
          searchableColumnCount={0}
          showViewOptions={false}
        />
      ) : (
        <DefaultTable table={table} />
      )}

      {/* View detail modal */}
      <ViewDetailModal
        open={!!selectedDepartment}
        onOpenChange={(open) => {
          if (!open) setSelectedDepartment(null);
        }}
        title="Department Details"
        fields={viewFields}
      />
    </div>
  );
}

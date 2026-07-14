import { useCallback, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { useDoctors } from "../hooks/useDoctorsQueries";
import { useDeleteDoctor } from "../hooks/useDoctorMutations";
import { getDoctorColumns } from "../components/doctorColumns";
import type { Doctor } from "../types/doctor.types";
import { DefaultTable } from "@/shared/components/core/table/DefaultTable";
import { DefaultTableSkeleton } from "@/shared/components/core/table/DefaultTableSkelton";
import { Input } from "@/shared/components/ui/input";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { ViewDetailModal, type ViewDetailField } from "@/shared/components/core/ViewDetailModal";
import { Search } from "lucide-react";

const PAGE_SIZE = 10;

export default function DoctorList() {
  // ── Search ──────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  // ── Cursor-based pagination ─────────────────────────────
  const [currentCursor, setCurrentCursor] = useState<string | undefined>();
  const [cursorStack, setCursorStack] = useState<(string | undefined)[]>([]);
  const pageIndex = cursorStack.length;

  // ── Data fetching ───────────────────────────────────────
  const { data, isLoading, error } = useDoctors({
    search: debouncedSearch || undefined,
    cursor: currentCursor,
    limit: PAGE_SIZE,
  });

  const { mutate: deleteDoctor } = useDeleteDoctor();

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
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const viewFields: ViewDetailField[] = useMemo(() => {
    if (!selectedDoctor) return [];
    const dept = selectedDoctor.department;
    const deptName = typeof dept === "object" && dept ? dept.name : dept || "—";
    return [
      { label: "Name", value: selectedDoctor.name },
      { label: "Email", value: selectedDoctor.email },
      { label: "Phone", value: selectedDoctor.phone },
      { label: "Department", value: deptName as string },
      { label: "Specialization", value: selectedDoctor.specialization || "—" },
      { label: "Qualification", value: selectedDoctor.qualification || "—" },
      { label: "Status", value: selectedDoctor.isActive ? "Active" : "Inactive" },
      {
        label: "Created At",
        value: new Date(selectedDoctor.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      },
    ];
  }, [selectedDoctor]);

  // ── Columns ─────────────────────────────────────────────
  const columns = useMemo(() => getDoctorColumns(), []);
  const doctors = useMemo(() => data?.data ?? [], [data?.data]);

  // ── Table instance ──────────────────────────────────────
  const table = useReactTable({
    data: doctors,
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
      onView: (doc: Doctor) => setSelectedDoctor(doc),
      onDelete: (doc: Doctor) => deleteDoctor(doc.id),
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
          placeholder="Search doctors..."
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
          columnCount={5}
          rowCount={5}
          searchableColumnCount={0}
          showViewOptions={false}
        />
      ) : (
        <DefaultTable table={table} />
      )}

      {/* View detail modal */}
      <ViewDetailModal
        open={!!selectedDoctor}
        onOpenChange={(open) => {
          if (!open) setSelectedDoctor(null);
        }}
        title="Doctor Detailds"
        fields={viewFields}
      />
    </div>
  );
}

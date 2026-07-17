import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { FieldGroup } from "@/shared/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import {
  createDepartmentSchema,
  type CreateDepartmentInput,
} from "../validation/department.schema";
import DefaultTextInput from "@/shared/components/core/DefaultTextInput";
import DefaultTextArea from "@/shared/components/core/DefaultTextArea";
import { useEffect } from "react";
import { useCreateDepartment, useUpdateDepartment } from "../hooks/useDepartmentMutations";
import { useGetDepartment } from "../hooks/useDepartmentsQueries";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function DepartmentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const {
    mutate: createDepartment,
    isPending: isCreatePending,
    error: createError,
  } = useCreateDepartment();
  const {
    mutate: updateDepartment,
    isPending: isUpdatePending,
    error: updateError,
  } = useUpdateDepartment();
  const { data: departmentData, isLoading: isDepartmentLoading } = useGetDepartment(id as string);

  const error = createError || updateError;
  const isPending = isCreatePending || isUpdatePending;

  const form = useForm<CreateDepartmentInput>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: CreateDepartmentInput) => {
    if (isEdit) {
      updateDepartment(
        { id, payload: values },
        {
          onSuccess: () => navigate("/departments"),
        },
      );
    } else {
      createDepartment(values, {
        onSuccess: () => navigate("/departments"),
      });
    }
  };

  useEffect(() => {
    if (isEdit && departmentData) {
      form.reset({
        name: departmentData?.name,
        description: departmentData?.description,
      });
    }
  }, [isEdit, departmentData]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Failed to {isEdit ? "update" : "create"} department</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Something went wrong. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {isDepartmentLoading ? (
          <Skeleton className="h-24" />
        ) : (
          <>
            <DefaultTextInput
              control={form.control}
              name="name"
              label="Department Name"
              placeholder="e.g. Ortho"
              autoComplete="off"
            />

            <DefaultTextArea
              control={form.control}
              name="description"
              label="Description"
              placeholder="Briefly describe this department"
            />
          </>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/departments")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || isDepartmentLoading}>
            {isEdit
              ? isPending
                ? "Updating..."
                : "Update Department"
              : isPending
                ? "Creating..."
                : "Create Department"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

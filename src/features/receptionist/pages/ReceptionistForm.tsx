import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";

import { FieldGroup } from "@/shared/components/ui/field";
import { Button } from "@/shared/components/ui/button";
import { Alert } from "@/shared/components/ui/alert";

import { useCreateReceptionist, useUpdateReceptionist } from "../hooks/useReceptionistMutations";
import { useGetReceptionist } from "../hooks/useReceptionistQueries";
import DefaultTextInput from "@/shared/components/core/DefaultTextInput";

const createReceptionistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  phone: z.string().min(10, "Phone number is required"),
  assignedDesk: z.string().optional(),
});

type CreateReceptionistInput = z.infer<typeof createReceptionistSchema>;

export default function ReceptionistForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const {
    mutate: createReceptionist,
    isPending: isCreatePending,
    error: createError,
  } = useCreateReceptionist();
  const {
    mutate: updateReceptionist,
    isPending: isUpdatePending,
    error: updateError,
  } = useUpdateReceptionist();

  const { data: receptionistData, isLoading: isReceptionistLoading } = useGetReceptionist(
    id as string,
  );

  const error = createError || updateError;
  const isPending = isCreatePending || isUpdatePending;

  const form = useForm<CreateReceptionistInput>({
    resolver: zodResolver(createReceptionistSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      assignedDesk: "",
    },
  });

  const onSubmit = (values: CreateReceptionistInput) => {
    const payload = {
      ...values,
      assignedDesk: values.assignedDesk || undefined,
    };

    if (isEdit) {
      updateReceptionist(
        { id: id as string, payload },
        {
          onSuccess: () => navigate("/receptionists"),
        },
      );
    } else {
      createReceptionist(payload, {
        onSuccess: () => navigate("/receptionists"),
      });
    }
  };

  useEffect(() => {
    if (isEdit && receptionistData) {
      form.reset({
        name: receptionistData.name,
        email: receptionistData.email,
        phone: receptionistData.phone,
        assignedDesk: receptionistData.assignedDesk || "",
      });
    }
  }, [isEdit, receptionistData, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        {error && (
          <Alert variant="destructive">{error.message || "Failed to save receptionist"}</Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DefaultTextInput
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="Enter full name"
            readOnly={isReceptionistLoading}
          />

          <DefaultTextInput
            control={form.control}
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            readOnly={isReceptionistLoading}
          />

          {!isEdit && (
            <DefaultTextInput
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="Create a secure password"
              readOnly={isReceptionistLoading}
            />
          )}

          <DefaultTextInput
            control={form.control}
            name="phone"
            label="Phone Number"
            placeholder="Enter contact number"
            readOnly={isReceptionistLoading}
          />

          <DefaultTextInput
            control={form.control}
            name="assignedDesk"
            label="Assigned Desk"
            placeholder="e.g. Front Desk A"
            readOnly={isReceptionistLoading}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/receptionists")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || isReceptionistLoading}>
            {isEdit
              ? isPending
                ? "Updating..."
                : "Update Receptionist"
              : isPending
                ? "Creating..."
                : "Create Receptionist"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

import { FieldGroup } from "@/shared/components/ui/field";
import { Button } from "@/shared/components/ui/button";
import { Alert } from "@/shared/components/ui/alert";
import DefaultTextInput from "@/shared/components/core/DefaultTextInput";

import { useCreatePatient, useUpdatePatient } from "../hooks/usePatientMutations";
import { useGetPatient } from "../hooks/usePatientQueries";
import type { CreatePatientPayload } from "../types/patient.types";
import { DefaultSelect } from "@/shared/components/core/DefaultSelect";
import DefaultDatePicker from "@/shared/components/core/DefaultDatePicker";
import {
  bloodGroupEnum,
  createPatientSchema,
  genderEnum,
  type CreatePatientInput,
} from "../validation/patient.schema";
import type z from "zod";

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const bloodGroupOptions = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];

export default function PatientForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const {
    mutate: createPatient,
    isPending: isCreatePending,
    error: createError,
  } = useCreatePatient();
  const {
    mutate: updatePatient,
    isPending: isUpdatePending,
    error: updateError,
  } = useUpdatePatient();

  const { data: patientData, isLoading: isPatientLoading } = useGetPatient(id as string);

  const error = createError || updateError;
  const isPending = isCreatePending || isUpdatePending;

  const form = useForm<CreatePatientInput>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      dateOfBirth: undefined,
      phone: "",
      email: "",
      bloodGroup: undefined,
    },
  });

  const onSubmit = (values: CreatePatientInput) => {
    const payload: CreatePatientPayload = {
      ...values,
      email: values.email || undefined,
      bloodGroup: values.bloodGroup || undefined,
      address: values.address?.line1
        ? (values.address as CreatePatientPayload["address"])
        : undefined,
      emergencyContact: values.emergencyContact?.name
        ? (values.emergencyContact as CreatePatientPayload["emergencyContact"])
        : undefined,
    };

    if (isEdit) {
      updatePatient(
        { id: id as string, payload },
        {
          onSuccess: () => navigate("/patients"),
        },
      );
    } else {
      createPatient(payload, {
        onSuccess: () => navigate("/patients"),
      });
    }
  };

  useEffect(() => {
    if (isEdit && patientData) {
      form.reset({
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        gender: patientData.gender as z.infer<typeof genderEnum>,
        dateOfBirth: new Date(patientData.dateOfBirth),
        phone: patientData.phone,
        email: patientData.email || "",
        bloodGroup: (patientData.bloodGroup as z.infer<typeof bloodGroupEnum>) || undefined,
        address: patientData.address || {
          line1: "",
          line2: "",
          city: "",
          state: "",
          country: "India",
          pincode: "",
        },
        emergencyContact: patientData.emergencyContact || {
          name: "",
          relationship: "",
          phone: "",
        },
      });
    }
  }, [isEdit, patientData, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        {error && <Alert variant="destructive">{error.message || "Failed to save patient"}</Alert>}

        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <DefaultTextInput
                control={form.control}
                name="firstName"
                label="First Name"
                readOnly={isPatientLoading}
              />
              <DefaultTextInput
                control={form.control}
                name="lastName"
                label="Last Name"
                readOnly={isPatientLoading}
              />
              <DefaultSelect
                control={form.control}
                name="gender"
                label="Gender"
                options={genderOptions}
                isLoading={isPatientLoading}
              />
              <DefaultDatePicker
                control={form.control}
                name="dateOfBirth"
                label="Date of Birth"
                enableYearNavigation
                startMonth={new Date(1920, 0)}
                endMonth={new Date()}

                readOnly={isPatientLoading}
              />
              <DefaultTextInput
                control={form.control}
                name="phone"
                label="Phone Number"
                readOnly={isPatientLoading}
              />
              <DefaultTextInput
                control={form.control}
                name="email"
                label="Email Address"
                type="email"
                readOnly={isPatientLoading}
              />
              <DefaultSelect
                control={form.control}
                name="bloodGroup"
                label="Blood Group"
                options={bloodGroupOptions}
                isLoading={isPatientLoading}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-medium">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <DefaultTextInput
                control={form.control}
                name="address.line1"
                label="Address Line 1"
                readOnly={isPatientLoading}
              />
              <DefaultTextInput
                control={form.control}
                name="address.line2"
                label="Address Line 2 (Optional)"
                readOnly={isPatientLoading}
              />
              <DefaultTextInput
                control={form.control}
                name="address.city"
                label="City"
                readOnly={isPatientLoading}
              />
              <DefaultTextInput
                control={form.control}
                name="address.state"
                label="State"
                readOnly={isPatientLoading}
              />
              <DefaultTextInput
                control={form.control}
                name="address.pincode"
                label="Pincode"
                readOnly={isPatientLoading}
              />
              <DefaultTextInput
                control={form.control}
                name="address.country"
                label="Country"
                readOnly={isPatientLoading}
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="text-lg font-medium">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <DefaultTextInput
                control={form.control}
                name="emergencyContact.name"
                label="Contact Name"
                readOnly={isPatientLoading}
              />
              <DefaultTextInput
                control={form.control}
                name="emergencyContact.relationship"
                label="Relationship"
                readOnly={isPatientLoading}
              />
              <DefaultTextInput
                control={form.control}
                name="emergencyContact.phone"
                label="Contact Phone"
                readOnly={isPatientLoading}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/patients")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || isPatientLoading}>
            {isEdit
              ? isPending
                ? "Updating..."
                : "Update Patient"
              : isPending
                ? "Creating..."
                : "Create Patient"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

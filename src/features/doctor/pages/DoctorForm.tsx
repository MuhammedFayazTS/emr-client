import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { FieldGroup } from "@/shared/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { createDoctorSchema, type CreateDoctorInput } from "../validation/doctor.schema";
import DefaultTextInput from "@/shared/components/core/DefaultTextInput";
import { DefaultSelect } from "@/shared/components/core/DefaultSelect";
import { useEffect, useMemo } from "react";
import { useCreateDoctor, useUpdateDoctor } from "../hooks/useDoctorMutations";
import { useGetDoctor } from "../hooks/useDoctorsQueries";
import { useGetDepartments } from "@/features/department/hooks/useDepartmentsQueries";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatOption, formatOptions } from "@/shared/utils/utils";

export default function DoctorForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const { mutate: createDoctor, isPending: isCreatePending, error: createError } = useCreateDoctor();
    const { mutate: updateDoctor, isPending: isUpdatePending, error: updateError } = useUpdateDoctor();
    const { data: doctorData, isLoading: isDoctorLoading } = useGetDoctor(id as string);
    // Todo add virtualized + infinite drop down
    const { data: departmentsData, isLoading: isDepartmentsLoading } = useGetDepartments({ limit: 100 });

    const error = createError || updateError;
    const isPending = isCreatePending || isUpdatePending;

    const form = useForm<CreateDoctorInput>({
        resolver: zodResolver(createDoctorSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            phone: "",
            department: "",
            specialization: "",
            qualification: "",
            scheduleId: "",
        },
    });

    const departmentOptions = useMemo(() => {
        return formatOptions(departmentsData?.data || []);
    }, [departmentsData]);

    const onSubmit = (values: CreateDoctorInput) => {
        const payload = {
            ...values,
            specialization: values.specialization || undefined,
            qualification: values.qualification || undefined,
            scheduleId: values.scheduleId || undefined,
        };

        if (isEdit) {
            updateDoctor({ id: id as string, payload }, {
                onSuccess: () => navigate("/doctors"),
            });
        } else {
            createDoctor(payload, {
                onSuccess: () => navigate("/doctors"),
            });
        }
    };

    useEffect(() => {
        if (isEdit && doctorData) {

            const deptId = doctorData.department?._id ;

            form.reset({
                name: doctorData.name,
                email: doctorData.email,
                phone: doctorData.phone,
                ...(deptId ? { department: deptId } : {} as any),
                specialization: doctorData.specialization || "",
                qualification: doctorData.qualification || "",
                scheduleId: doctorData.scheduleId || "",
            });
        }
    }, [isEdit, doctorData, form]);

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
                {error && (
                    <Alert variant="destructive">
                        <AlertCircleIcon className="h-4 w-4" />
                        <AlertTitle>Failed to {isEdit ? "update" : "create"} doctor</AlertTitle>
                        <AlertDescription>
                            {error instanceof Error ? error.message : "Something went wrong. Please try again."}
                        </AlertDescription>
                    </Alert>
                )}

                {isDoctorLoading || isDepartmentsLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : (
                    <>
                        <DefaultTextInput
                            control={form.control}
                            name="name"
                            label="Full Name"
                            placeholder="e.g. Dr. John Doe"
                            autoComplete="off"
                        />

                        <DefaultTextInput
                            control={form.control}
                            name="email"
                            label="Email Address"
                            placeholder="e.g. john.doe@hospital.com"
                            autoComplete="off"
                            readOnly={isEdit}
                        />

                        {!isEdit && (
                            <DefaultTextInput
                                control={form.control}
                                name="password"
                                label="Password"
                                type="password"
                                placeholder="Min 6 characters"
                                autoComplete="off"
                            />
                        )}

                        <DefaultTextInput
                            control={form.control}
                            name="phone"
                            label="Phone Number"
                            placeholder="e.g. +1234567890"
                            autoComplete="off"
                        />

                        <DefaultSelect
                            control={form.control}
                            name="department"
                            label="Department"
                            placeholder="Select a department"
                            options={departmentOptions}
                        />

                        <DefaultTextInput
                            control={form.control}
                            name="specialization"
                            label="Specialization"
                            placeholder="e.g. Cardiology"
                        />

                        <DefaultTextInput
                            control={form.control}
                            name="qualification"
                            label="Qualification"
                            placeholder="e.g. MD, FACC"
                        />
                    </>
                )}

                <div className="flex justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/doctors")}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending || isDoctorLoading}>
                        {isEdit ? (
                            isPending ? "Updating..." : "Update Doctor"
                        ) : (
                            isPending ? "Creating..." : "Create Doctor"
                        )}
                    </Button>
                </div>
            </FieldGroup>
        </form>
    );
}

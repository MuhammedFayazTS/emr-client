import z from "zod";

export const createDoctorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 6 characters"),
  phone: z.string().min(1, "Phone number is required"),
  department: z.string().min(1, "Department is required"),
  specialization: z
    .string()
    .max(100, "Specialization must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  qualification: z
    .string()
    .max(100, "Qualification must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  scheduleId: z.string().optional().or(z.literal("")),
});

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;

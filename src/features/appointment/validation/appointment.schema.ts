import z from "zod";

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Object ID format");

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .refine((val) => !isNaN(Date.parse(val)), { message: "Date must be a valid calendar date" });

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be in HH:mm format");

const slotSelectionSchema = z.object({
  startTime: timeSchema,
  endTime: timeSchema,
  date: z.string(),
  doctorId: z.string().optional(),
  isBooked: z.boolean().optional(),
});

export const createAppointmentSchema = z.object({
  patientId: objectIdSchema,
  doctorId: objectIdSchema,
  departmentId: objectIdSchema,
  date: dateSchema,
  startTime: timeSchema,
  endTime: timeSchema,
  purpose: z.string().optional(),
  notes: z.string().optional(),
});

export const createAppointmentFormSchema = z
  .object({
    patientId: objectIdSchema,
    doctorId: objectIdSchema,
    departmentId: objectIdSchema,
    date: z.date({ error: "Appointment date is required" }),
    slot: slotSelectionSchema.optional(),
    purpose: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.slot) {
      ctx.addIssue({
        code: "custom",
        path: ["slot"],
        message: "Please select a time slot",
      });
    }
  });

export const updateAppointmentSchema = z.object({
  purpose: z.string().optional(),
  notes: z.string().optional(),
});

export const cancelAppointmentSchema = z.object({
  cancelReason: z.string().min(1, "Cancel reason is required"),
});

export const rescheduleAppointmentSchema = z.object({
  date: dateSchema,
  startTime: timeSchema,
  endTime: timeSchema,
});

export const searchAppointmentSchema = z.object({
  doctorId: objectIdSchema.optional(),
  departmentId: objectIdSchema.optional(),
  patientId: objectIdSchema.optional(),
  status: z
    .enum(["SCHEDULED", "ARRIVED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"])
    .optional(),
  dateFrom: dateSchema.optional(),
  dateTo: dateSchema.optional(),
  limit: z.coerce.number().optional(),
  cursor: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type CreateAppointmentFormInput = z.infer<typeof createAppointmentFormSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type CancelAppointmentInput = z.infer<typeof cancelAppointmentSchema>;
export type RescheduleAppointmentInput = z.infer<typeof rescheduleAppointmentSchema>;
export type SearchAppointmentInput = z.infer<typeof searchAppointmentSchema>;

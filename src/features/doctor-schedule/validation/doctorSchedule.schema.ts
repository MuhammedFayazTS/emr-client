    import z from "zod";
    import { DayOfWeek } from "@/shared/constants/days";

    export const dayOfWeekEnum = z.enum(DayOfWeek);

    const timeSlotSchema = z.object({
        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),
    });

    const dayScheduleSchema = z.object({
        day: dayOfWeekEnum,
        isAvailable: z.boolean(),
        slots: z.array(timeSlotSchema),
    });


    const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be in HH:mm format");

    const sessionSchema = z.object({
        startTime: timeSchema,
        endTime: timeSchema,
        name: z.string().min(1, "Session name cannot be empty"),
    }).refine(
        (data) => data.startTime < data.endTime,
        { message: "Start time must be before end time" }
    );

    const workingDaySchema = z.object({
        dayOfWeek: z.enum(DayOfWeek),
        isWorking: z.boolean(),
        sessions: z.array(sessionSchema).default([]),
    });

    export const createDoctorScheduleSchema = z.object({
        doctorId: z.string(),
        isActive: z.boolean().optional().default(true),
        slotDuration: z.number().int().positive("Slot duration must be positive"),
        workingDays: z.array(workingDaySchema).default([]),
    });


    // Shape BEFORE coercion — what react-hook-form's internal state actually holds.
    // slotDuration here is whatever the <Input> gives it (string/unknown) before zodResolver coerces it.
    export type CreateDoctorScheduleFormInput = z.input<typeof createDoctorScheduleSchema>;

    // Shape AFTER coercion/validation — what you get in `onSubmit`, and what your
    // API mutation (useCreateDoctorSchedule) should expect as its payload type.
    export type CreateDoctorScheduleOutput = z.output<typeof createDoctorScheduleSchema>;
import z from "zod";
export const genderEnum = z.enum(["Male", "Female", "Other"]);

export const bloodGroupEnum = z.enum([
    "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
]);

const addressSchema = z.object({
    line1: z.string().min(1, "Address line 1 is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    pincode: z.string().min(1, "Pincode is required"),
});

const emergencyContactSchema = z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    phone: z.string().min(10, "Phone number is required"),
});

export const createPatientSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    gender: genderEnum,
    dateOfBirth: z.date(),
    phone: z.string(),
    email: z.email("Invalid email format").optional(),
    bloodGroup: bloodGroupEnum.optional(),
    address: addressSchema.partial().optional(),
    emergencyContact: emergencyContactSchema.partial().optional(),
}).superRefine((data, ctx) => {
    const addr = data.address;
    const addressStarted = addr && Object.values(addr).some((v) => v && v.trim() !== "");

    if (addressStarted) {
        if (!addr?.line1) ctx.addIssue({ code: "custom", path: ["address", "line1"], message: "Address line 1 is required" });
        if (!addr?.city) ctx.addIssue({ code: "custom", path: ["address", "city"], message: "City is required" });
        if (!addr?.state) ctx.addIssue({ code: "custom", path: ["address", "state"], message: "State is required" });
        if (!addr?.pincode) ctx.addIssue({ code: "custom", path: ["address", "pincode"], message: "Pincode is required" });
    }

    const ec = data.emergencyContact;
    const ecStarted = ec && Object.values(ec).some((v) => v && v.trim() !== "");

    if (ecStarted) {
        if (!ec?.name) ctx.addIssue({ code: "custom", path: ["emergencyContact", "name"], message: "Emergency contact name is required" });
        if (!ec?.relationship) ctx.addIssue({ code: "custom", path: ["emergencyContact", "relationship"], message: "Relationship is required" });
        if (!ec?.phone) ctx.addIssue({ code: "custom", path: ["emergencyContact", "phone"], message: "Phone number is required" });
    }
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
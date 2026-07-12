import { z } from 'zod';
import { emailSchema, passwordSchema } from '@/shared/validation/primitives';

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    userAgent: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const loginFormSchema = loginSchema.omit({ userAgent: true });
export type LoginFormInput = z.infer<typeof loginFormSchema>;
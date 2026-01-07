import { z } from "zod";

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(1, "Name is required")
            .min(3, "Name must be at least 3 characters"),

        email: z
            .string()
            .min(1, "Email is required")
            .email("Invalid email address"),

        password: z
            .string()
            .min(6, "Password must be at least 6 characters"),

        confirm_password: z
            .string()
            .min(1, "Confirm password is required"),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match",
        path: ["confirm_password"], // 👈 show error under confirm field
    });

export type RegisterFormData = z.infer<typeof registerSchema>;

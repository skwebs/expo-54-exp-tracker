import { z } from "zod";

export const formSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Minimum 6 characters"),
});

export type FormData = z.infer<typeof formSchema>;

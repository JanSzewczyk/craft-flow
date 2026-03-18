import { z } from "zod";

export const emailVerificationSchema = z.object({
  code: z
    .string()
    .length(6, { message: "Kod musi mieć dokładnie 6 cyfr" })
    .regex(/^\d+$/, { message: "Kod może zawierać tylko cyfry" })
});

export type EmailVerificationFormData = z.output<typeof emailVerificationSchema>;

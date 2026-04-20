import { z } from "zod";

export const emailSchema = z.object({
  emailSubject: z.string().min(1, "Temat nie może być pusty"),
  emailBody: z.string().min(10, "Treść musi mieć co najmniej 10 znaków")
});

export type EmailFormData = z.output<typeof emailSchema>;

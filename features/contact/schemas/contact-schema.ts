import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Imię musi mieć co najmniej 2 znaki" })
    .max(100, { message: "Imię jest za długie" }),
  email: z.email({ message: "Podaj prawidłowy adres e-mail" }),
  subject: z.enum(["demo", "pricing", "support", "other"], { message: "Wybierz temat" }),
  message: z
    .string()
    .min(20, { message: "Wiadomość musi mieć co najmniej 20 znaków" })
    .max(2000, { message: "Wiadomość jest za długa" })
});

export type ContactFormData = z.output<typeof contactFormSchema>;

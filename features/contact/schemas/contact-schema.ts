import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Imię musi mieć co najmniej 2 znaki" })
    .max(100, { message: "Imię jest za długie" }),
  email: z.string().email({ message: "Podaj prawidłowy adres e-mail" }),
  subject: z
    .string()
    .min(5, { message: "Temat musi mieć co najmniej 5 znaków" })
    .max(200, { message: "Temat jest za długi" }),
  message: z
    .string()
    .min(20, { message: "Wiadomość musi mieć co najmniej 20 znaków" })
    .max(2000, { message: "Wiadomość jest za długa" })
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

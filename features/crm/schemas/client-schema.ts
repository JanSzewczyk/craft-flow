import { z } from "zod";

export const clientSchema = z.object({
  name: z
    .string()
    .min(2, "Imię i nazwisko musi mieć co najmniej 2 znaki")
    .max(255, "Imię i nazwisko nie może przekraczać 255 znaków"),
  email: z.email("Niepoprawny format adresu e-mail").max(255, "Adres e-mail nie może przekraczać 255 znaków"),
  phone: z.string().max(50, "Numer telefonu nie może przekraczać 50 znaków").nullable()
});

export type ClientFormData = z.infer<typeof clientSchema>;

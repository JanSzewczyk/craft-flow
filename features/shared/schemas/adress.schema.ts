import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(1, "Ulica jest wymagana").max(100, "Ulica nie może przekraczać 100 znaków"),
  postalCode: z
    .string()
    .min(1, "Kod pocztowy jest wymagany")
    .regex(/^\d{2}-\d{3}$/, "Nieprawidłowy kod pocztowy (wymagany format: XX-XXX)"),
  city: z.string().min(1, "Miasto jest wymagane").max(100, "Nazwa miasta nie może przekraczać 100 znaków"),
  country: z
    .string()
    .min(1, "Kraj jest wymagany")
    .max(100, "Nazwa kraju nie może przekraczać 100 znaków")
    .default("Polska"),
  additionalInfo: z.string().max(200, "Informacje dodatkowe nie mogą przekraczać 200 znaków").nullable()
});

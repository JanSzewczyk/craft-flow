import { z } from "zod";

export const projectSchema = z
  .object({
    name: z.string().min(3, "Nazwa musi mieć co najmniej 3 znaki").max(100, "Nazwa nie może przekraczać 100 znaków"),
    description: z.string().max(500, "Opis nie może przekraczać 500 znaków").nullable(),
    templateId: z.string().min(1, "Szablon jest wymagany"),
    clientId: z.string().optional(),
    newClient: z
      .object({
        name: z.string().min(2, "Imię i nazwisko musi mieć co najmniej 2 znaki"),
        email: z.string().email("Niepoprawny format adresu e-mail"),
        phone: z.string().nullable()
      })
      .optional()
  })
  .refine((d) => d.clientId !== undefined || d.newClient !== undefined, {
    message: "Wybierz istniejącego klienta lub podaj dane nowego.",
    path: ["clientId"]
  });

export type ProjectFormData = z.infer<typeof projectSchema>;

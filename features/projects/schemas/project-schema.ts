import { z } from "zod";

export const createProjectSchema = z
  .object({
    name: z.string().min(3, "Nazwa musi mieć co najmniej 3 znaki").max(100, "Nazwa nie może przekraczać 100 znaków"),
    templateId: z.string().min(1, "Szablon jest wymagany"),
    client: z.object({
      id: z.string().optional(),
      name: z.string().min(2, "Imię i nazwisko musi mieć co najmniej 2 znaki"),
      email: z.string().email("Niepoprawny format adresu e-mail").optional(),
      phone: z.string().nullable().optional()
    })
  })
  .refine((d) => d.client.id || d.client.email, {
    message: "E-mail jest wymagany dla nowego klienta.",
    path: ["client", "email"]
  });

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;

import { z } from "zod";

import { clientSchema } from "~/features/crm/schemas/client-schema";

export const projectClientSchema = z.discriminatedUnion("mode", [
  z
    .object({
      mode: z.literal("existing"),
      clientId: z.string().min(1, "Klient jest wymagany")
    })
    .extend(clientSchema.partial().shape),
  z
    .object({
      mode: z.literal("new"),
      clientId: z.string().optional()
    })
    .extend(clientSchema.shape)
]);

export const projectSchema = z.object({
  name: z.string().min(3, "Nazwa musi mieć co najmniej 3 znaki").max(100, "Nazwa nie może przekraczać 100 znaków"),
  description: z.string().max(500, "Opis nie może przekraczać 500 znaków").nullable(),
  templateId: z.string().min(1, "Szablon jest wymagany"),
  client: projectClientSchema
});

export type ProjectFormData = z.infer<typeof projectSchema>;

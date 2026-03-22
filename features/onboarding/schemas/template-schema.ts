import { z } from "zod";

export const templateSchema = z.object({
  templateSteps: z.array(z.string().min(1, "Nazwa etapu nie może być pusta")).min(1, "Dodaj co najmniej jeden etap")
});

export type TemplateFormData = z.output<typeof templateSchema>;

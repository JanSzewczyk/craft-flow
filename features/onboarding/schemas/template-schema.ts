import { z } from "zod";

export const templateStepSchema = z.object({
  title: z.string().min(1, "Nazwa etapu nie może być pusta"),
  description: z.string()
});

export const templateSchema = z.object({
  templateSteps: z.array(templateStepSchema)
});

export type TemplateStepFormData = z.input<typeof templateStepSchema>;
export type TemplateFormData = z.input<typeof templateSchema>;

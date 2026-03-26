import { z } from "zod";

export const templateStepSchema = z.object({
  title: z.string().min(1, "Nazwa etapu nie może być pusta"),
  description: z.string().nullable()
});

export const templateSchema = z.object({
  name: z.string().min(1, "Nazwa szablonu nie może być pusta"),
  description: z.string().nullable(),
  steps: z.array(templateStepSchema)
});

export type TemplateStepFormData = z.output<typeof templateStepSchema>;
export type TemplateFormData = z.output<typeof templateSchema>;

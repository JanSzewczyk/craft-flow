import { z } from "zod";

export const templateStepSchema = z.object({
  title: z.string().min(1, "Nazwa etapu nie może być pusta").max(80, "Nazwa etapu nie może przekraczać 80 znaków"),
  description: z.string().nullable()
});

export const templateSchema = z.object({
  name: z
    .string()
    .min(1, "Nazwa szablonu nie może być pusta")
    .max(255, "Nazwa szablonu nie może przekraczać 255 znaków"),
  description: z.string().nullable(),
  steps: z.array(templateStepSchema).min(1, "Szablon musi zawierać co najmniej jeden etap")
});

export type TemplateStepFormData = z.infer<typeof templateStepSchema>;
export type TemplateFormData = z.infer<typeof templateSchema>;

import { type TemplateStepFormData } from "~/features/onboarding/schemas/template-schema";

export const DEFAULT_TEMPLATE_NAME = "Mój szablon";

export const DEFAULT_TEMPLATE_STEPS: TemplateStepFormData[] = [
  { title: "Wycena", description: null },
  { title: "Pomiary", description: null },
  { title: "Zamówienie materiałów", description: null },
  { title: "Realizacja", description: null },
  { title: "Odbiór", description: null }
];

import { type TemplateStepFormData } from "~/features/onboarding/schemas/template-schema";

export const DEFAULT_TEMPLATE_NAME = "Mój szablon";

export const DEFAULT_TEMPLATE_STEPS: TemplateStepFormData[] = [
  { title: "Wycena", description: "" },
  { title: "Pomiary", description: "" },
  { title: "Zamówienie materiałów", description: "" },
  { title: "Realizacja", description: "" },
  { title: "Odbiór", description: "" }
];

import { type TemplateStepFormData } from "~/features/onboarding/schemas/template-schema";

export const DEFAULT_TEMPLATE_STEPS: TemplateStepFormData[] = [
  { title: "Wycena", description: "" },
  { title: "Pomiary", description: "" },
  { title: "Zamówienie materiałów", description: "" },
  { title: "Realizacja", description: "" },
  { title: "Odbiór", description: "" }
];

export const DEFAULT_EMAIL_SUBJECT = "Twój projekt {{projectName}} jest gotowy";

export const DEFAULT_EMAIL_BODY = `Cześć {{clientName}},

Z przyjemnością informujemy, że Twój projekt „{{projectName}}" został opublikowany w systemie {{companyName}}.

Data: {{date}}

Zapraszamy do przeglądu szczegółów w panelu klienta.

Pozdrawiamy,
Zespół {{companyName}}`;

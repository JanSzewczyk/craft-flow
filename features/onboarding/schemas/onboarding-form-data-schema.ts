import { type z } from "zod";

import { companyDetailsSchema } from "~/features/onboarding";

import { brandingSchema } from "./branding-schema";
import { emailSchema } from "./email-schema";
import { planSelectionSchema } from "./plan-selection-schema";
import { templateSchema } from "./template-schema";

export const onboardingFormDataSchema = planSelectionSchema
  .merge(companyDetailsSchema)
  .merge(brandingSchema.partial())
  .merge(templateSchema)
  .merge(emailSchema);

export type OnboardingFormData = z.output<typeof onboardingFormDataSchema>;

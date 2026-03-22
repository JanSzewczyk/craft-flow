import { type z } from "zod";

import { brandingSchema } from "./branding-schema";
import { companyDetailsSchema } from "./company-details-schema";
import { emailSchema } from "./email-schema";
import { planSelectionSchema } from "./plan-selection-schema";
import { templateSchema } from "./template-schema";

export const onboardingFormDataSchema = planSelectionSchema
  .merge(companyDetailsSchema)
  .merge(brandingSchema.partial())
  .merge(templateSchema)
  .merge(emailSchema);

export type OnboardingFormData = z.infer<typeof onboardingFormDataSchema>;

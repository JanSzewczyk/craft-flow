import { type z } from "zod";

import { brandingSchema } from "./branding-schema";
import { companyDetailsSchema } from "./company-details-schema";
import { emailSchema } from "./email-schema";
import { templateSchema } from "./template-schema";

export const onboardingFormDataSchema = companyDetailsSchema
  .merge(brandingSchema.partial())
  .merge(templateSchema)
  .merge(emailSchema);

export type OnboardingFormData = z.output<typeof onboardingFormDataSchema>;

import { z } from "zod";

import { brandingSchema } from "./branding-schema";
import { companyDetailsSchema } from "./company-details-schema";
import { emailSchema } from "./email-schema";
import { templateSchema } from "~/features/templates/schemas/template-schema";

export const onboardingFormDataSchema = z.object({
  companyDetails: companyDetailsSchema,
  branding: brandingSchema.nullable(),
  templateConfig: templateSchema,
  emailConfig: emailSchema.nullable()
});

export type OnboardingFormData = z.output<typeof onboardingFormDataSchema>;

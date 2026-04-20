import { z } from "zod";

import { brandingSchema } from "~/features/contractor/schemas/branding-schema";
import { companyDetailsSchema } from "~/features/contractor/schemas/company-details-schema";
import { emailSchema } from "~/features/contractor/schemas/email-schema";
import { templateSchema } from "~/features/templates/schemas/template-schema";

export const onboardingFormDataSchema = z.object({
  companyDetails: companyDetailsSchema,
  branding: brandingSchema.nullable(),
  templateConfig: templateSchema,
  emailConfig: emailSchema.nullable()
});

export type OnboardingFormData = z.output<typeof onboardingFormDataSchema>;

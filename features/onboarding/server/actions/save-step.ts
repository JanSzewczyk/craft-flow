"use server";

import { type z } from "zod";

import { auth } from "@clerk/nextjs/server";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { brandingSchema } from "~/features/onboarding/schemas/branding-schema";
import { companyDetailsSchema } from "~/features/onboarding/schemas/company-details-schema";
import { emailSchema } from "~/features/onboarding/schemas/email-schema";
import { templateSchema } from "~/features/onboarding/schemas/template-schema";
import { updateStepData } from "~/features/onboarding/server/db";
import { type ActionResponse } from "~/lib/action-types";

const stepSchemas: Record<string, z.ZodType> = {
  [OnboardingStep.COMPANY_DETAILS]: companyDetailsSchema,
  [OnboardingStep.BRANDING]: brandingSchema,
  [OnboardingStep.TEMPLATE]: templateSchema,
  [OnboardingStep.EMAIL]: emailSchema
};

export async function saveStep(
  currentStep: string,
  nextStep: string,
  formData: Record<string, unknown>
): ActionResponse<true> {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const schema = stepSchemas[currentStep];
  if (!schema) {
    return { success: false, error: "Nieznany krok" };
  }

  const parsed = schema.safeParse(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    return { success: false, error: "Nieprawidłowe dane", fieldErrors };
  }

  const [error] = await updateStepData(userId, currentStep, nextStep, parsed.data as Record<string, unknown>);
  if (error) return { success: false, error: "Nie udało się zapisać danych" };

  return { success: true, data: true };
}

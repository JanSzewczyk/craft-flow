"use server";

import { redirect } from "next/navigation";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { type BrandingFormData } from "~/features/onboarding/schemas/branding-schema";
import { type OnboardingState, updateStepData } from "~/features/onboarding/server/db";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-actions" });

export async function submitBrandingAction(
  branding: BrandingFormData,
  onboardingState: OnboardingState
): RedirectAction {
  const { contractorId } = onboardingState;
  logger.info({ contractorId }, "Submitting branding");

  const [error] = await updateStepData(contractorId, {
    currentStep: OnboardingStep.TEMPLATE,
    branding
  });
  if (error) {
    logger.error({ contractorId, errorCode: error.code }, "Failed to save branding");
    return { success: false, error: "Nie udało się zapisać danych brandingu" };
  }

  logger.info({ contractorId }, "Branding saved, redirecting to template step");
  redirect(OnboardingStep.TEMPLATE);
}

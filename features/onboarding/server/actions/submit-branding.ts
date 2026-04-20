"use server";

import { redirect } from "next/navigation";
import { type BrandingFormData } from "~/features/contractor/schemas/branding-schema";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { type OnboardingState, updateStepData } from "~/features/onboarding/server/db";
import { getOnboardingPlanConfig } from "~/features/onboarding/server/services/step-service";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-actions" });

export async function submitBrandingAction(
  branding: BrandingFormData,
  onboardingState: OnboardingState
): RedirectAction {
  const { contractorId } = onboardingState;
  logger.info({ contractorId }, "Submitting branding");

  const config = await getOnboardingPlanConfig(OnboardingStep.BRANDING);
  if (!config) {
    logger.error({ contractorId }, "No active plan found");
    return { success: false, error: "Nie znaleziono aktywnego planu" };
  }

  const [error] = await updateStepData(contractorId, {
    currentStep: config.nextStep,
    branding
  });
  if (error) {
    logger.error({ contractorId, errorCode: error.code }, "Failed to save branding");
    return { success: false, error: "Nie udało się zapisać danych brandingu" };
  }

  logger.info({ contractorId }, "Branding saved, redirecting to next step");
  redirect(config.nextStep);
}

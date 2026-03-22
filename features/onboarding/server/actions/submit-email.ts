"use server";

import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { type EmailFormData } from "~/features/onboarding/schemas/email-schema";
import { completeOnboarding } from "~/features/onboarding/server/actions/complete-onboarding";
import { type OnboardingState, updateStepData } from "~/features/onboarding/server/db";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-actions" });

export async function submitEmailAction(emailConfig: EmailFormData, onboardingState: OnboardingState): RedirectAction {
  const { contractorId } = onboardingState;
  logger.info({ contractorId }, "Submitting email config");

  const [error] = await updateStepData(contractorId, {
    currentStep: OnboardingStep.EMAIL,
    emailConfig
  });
  if (error) {
    logger.error({ contractorId, errorCode: error.code }, "Failed to save email config");
    return { success: false, error: "Nie udało się zapisać konfiguracji e-mail" };
  }

  logger.info({ contractorId }, "Email config saved, completing onboarding");
  return completeOnboarding();
}

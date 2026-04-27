"use server";

import { redirect } from "next/navigation";
import { type EmailFormData } from "~/features/contractor/schemas/email-schema";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { type OnboardingState, updateStepData } from "~/features/onboarding/server/db";
import { getOnboardingPlanConfig } from "~/features/onboarding/server/services/step-service";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-actions" });

export async function submitEmailAction(emailConfig: EmailFormData, onboardingState: OnboardingState): RedirectAction {
  const { contractorId } = onboardingState;
  logger.info({ contractorId }, "Submitting email config");

  const config = await getOnboardingPlanConfig(OnboardingStep.EMAIL);
  if (!config) {
    logger.error({ contractorId }, "No active plan found");
    return { success: false, error: "Nie znaleziono aktywnego planu" };
  }

  const [error] = await updateStepData({
    contractorId,
    stepData: {
      currentStep: config.nextStep,
      emailConfig
    }
  });
  if (error) {
    logger.error({ contractorId, errorCode: error.code }, "Failed to save email config");
    return { success: false, error: "Nie udało się zapisać konfiguracji e-mail" };
  }

  logger.info({ contractorId, nextStep: config.nextStep }, "Email config saved, redirecting to next step");
  redirect(config.nextStep);
}

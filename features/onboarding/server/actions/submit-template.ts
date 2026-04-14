"use server";

import { redirect } from "next/navigation";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { type OnboardingState, updateStepData } from "~/features/onboarding/server/db";
import { getOnboardingPlanConfig } from "~/features/onboarding/server/services/step-service";
import { type TemplateFormData } from "~/features/templates/schemas/template-schema";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-actions" });

export async function submitTemplateAction(
  templateConfig: TemplateFormData,
  onboardingState: OnboardingState
): RedirectAction {
  const { contractorId } = onboardingState;
  logger.info({ contractorId }, "Submitting template config");

  const config = await getOnboardingPlanConfig(OnboardingStep.TEMPLATE);
  if (!config) {
    logger.error({ contractorId }, "No active plan found");
    return { success: false, error: "Nie znaleziono aktywnego planu" };
  }

  const [error] = await updateStepData(contractorId, {
    currentStep: config.nextStep,
    templateConfig
  });
  if (error) {
    logger.error({ contractorId, errorCode: error.code }, "Failed to save template config");
    return { success: false, error: "Nie udało się zapisać konfiguracji szablonu" };
  }

  logger.info({ contractorId, nextStep: config.nextStep }, "Template config saved, redirecting to next step");
  redirect(config.nextStep);
}

"use server";

import { redirect } from "next/navigation";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { type TemplateFormData } from "~/features/onboarding/schemas/template-schema";
import { type OnboardingState, updateStepData } from "~/features/onboarding/server/db";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-actions" });

export async function submitTemplateAction(
  templateConfig: TemplateFormData,
  onboardingState: OnboardingState
): RedirectAction {
  const { contractorId } = onboardingState;
  logger.info({ contractorId }, "Submitting template config");

  const [error] = await updateStepData(contractorId, {
    currentStep: OnboardingStep.EMAIL,
    templateConfig
  });
  if (error) {
    logger.error({ contractorId, errorCode: error.code }, "Failed to save template config");
    return { success: false, error: "Nie udało się zapisać konfiguracji szablonu" };
  }

  logger.info({ contractorId }, "Template config saved, redirecting to email step");
  redirect(OnboardingStep.EMAIL);
}

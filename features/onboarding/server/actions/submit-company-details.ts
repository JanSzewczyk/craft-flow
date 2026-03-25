"use server";

import { redirect } from "next/navigation";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { type CompanyDetailsFormData } from "~/features/onboarding/schemas";
import { type OnboardingState, updateStepData } from "~/features/onboarding/server/db";
import { getOnboardingPlanConfig } from "~/features/onboarding/server/services/step-service";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-actions" });

export async function submitCompanyDetailsAction(
  companyDetails: CompanyDetailsFormData,
  onboardingState: OnboardingState
): RedirectAction {
  const { contractorId } = onboardingState;
  logger.info({ contractorId }, "Submitting company details");

  const config = await getOnboardingPlanConfig(OnboardingStep.COMPANY_DETAILS);
  if (!config) {
    logger.error({ contractorId }, "No active plan found");
    return { success: false, error: "Nie znaleziono aktywnego planu" };
  }

  const [error] = await updateStepData(contractorId, {
    currentStep: config.nextStep,
    companyDetails
  });
  if (error) {
    logger.error({ contractorId, errorCode: error.code }, "Failed to save company details");
    return { success: false, error: "Nie udało się zapisać danych firmy" };
  }

  logger.info({ contractorId, nextStep: config.nextStep }, "Company details saved, redirecting to next step");
  redirect(config.nextStep);
}

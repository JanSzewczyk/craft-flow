"use server";

import { redirect } from "next/navigation";
import { type CompanyDetailsFormData } from "~/features/onboarding";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { type OnboardingState, updateStepData } from "~/features/onboarding/server/db";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-actions" });

export async function submitCompanyDetailsAction(
  companyDetails: CompanyDetailsFormData,
  onboardingState: OnboardingState
): RedirectAction {
  const { contractorId } = onboardingState;
  logger.info({ contractorId }, "Submitting company details");

  const [error] = await updateStepData(contractorId, {
    currentStep: OnboardingStep.EMAIL,
    companyDetails
  });
  if (error) {
    logger.error({ contractorId, errorCode: error.code }, "Failed to save company details");
    return { success: false, error: "Nie udało się zapisać danych firmy" };
  }

  logger.info({ contractorId }, "Company details saved, redirecting to email step");
  redirect(OnboardingStep.EMAIL);
}

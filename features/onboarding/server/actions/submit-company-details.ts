"use server";

import { redirect } from "next/navigation";
import { type CompanyDetailsFormData } from "~/features/onboarding";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { planHasBranding } from "~/features/onboarding/constants/plans";
import { detectClerkPlan } from "~/features/onboarding/server/api/detect-clerk-plan";
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

  const planId = await detectClerkPlan();
  const nextStep = planId && planHasBranding(planId) ? OnboardingStep.BRANDING : OnboardingStep.TEMPLATE;

  const [error] = await updateStepData(contractorId, {
    currentStep: nextStep,
    companyDetails
  });
  if (error) {
    logger.error({ contractorId, errorCode: error.code }, "Failed to save company details");
    return { success: false, error: "Nie udało się zapisać danych firmy" };
  }

  logger.info({ contractorId, nextStep }, "Company details saved, redirecting to next step");
  redirect(nextStep);
}

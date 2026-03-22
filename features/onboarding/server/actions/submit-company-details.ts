"use server";

import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { completeOnboarding } from "~/features/onboarding/server/actions/complete-onboarding";
import { saveStep } from "~/features/onboarding/server/actions/save-step";
import { type RedirectAction } from "~/lib/action-types";
import { type CompanyDetailsFormData } from "~/features/onboarding";

export async function submitCompanyDetailsAction(formData: CompanyDetailsFormData): RedirectAction {
  const saveResult = await saveStep(OnboardingStep.EMAIL, OnboardingStep.EMAIL, formData);

  if (!saveResult.success) {
    return saveResult;
  }

  return completeOnboarding();
}

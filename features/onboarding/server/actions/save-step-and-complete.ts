"use server";

import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { completeOnboarding } from "~/features/onboarding/server/actions/complete-onboarding";
import { saveStep } from "~/features/onboarding/server/actions/save-step";
import { type RedirectAction } from "~/lib/action-types";

export async function saveStepAndComplete(formData: Record<string, unknown>): RedirectAction {
  const saveResult = await saveStep(OnboardingStep.EMAIL, OnboardingStep.EMAIL, formData);

  if (!saveResult.success) {
    return saveResult;
  }

  return completeOnboarding();
}

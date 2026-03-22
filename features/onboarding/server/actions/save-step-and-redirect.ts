"use server";

import { redirect } from "next/navigation";
import { saveStep } from "~/features/onboarding/server/actions/save-step";
import { type RedirectAction } from "~/lib/action-types";

export async function saveStepAndRedirect(
  currentStep: string,
  nextStep: string,
  formData: Record<string, unknown>
): RedirectAction {
  const result = await saveStep(currentStep, nextStep, formData);

  if (!result.success) {
    return result;
  }

  redirect(nextStep);
}

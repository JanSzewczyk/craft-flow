"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Role } from "~/features/auth/constants/roles";
import { setUserMetadata } from "~/features/auth/server/api/set-user-metadata";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { onboardingFormDataSchema } from "~/features/onboarding/schemas/onboarding-form-data-schema";
import { getCachedOnboardingState, markOnboardingComplete } from "~/features/onboarding/server/db";
import { getOnboardingPlanConfig } from "~/features/onboarding/server/services/step-service";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding" });

export async function completeOnboarding(): RedirectAction {
  const { userId, isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const [getError, state] = await getCachedOnboardingState(userId);
  if (getError) {
    return { success: false, error: "Nie znaleziono stanu onboardingu" };
  }

  const config = await getOnboardingPlanConfig(OnboardingStep.EMAIL);
  const formData = {
    ...state.companyDetails,
    ...state.branding,
    ...state.templateConfig,
    ...state.emailConfig,
    planId: config?.plan.id
  };
  const parsed = onboardingFormDataSchema.safeParse(formData);
  if (!parsed.success) {
    logger.warn({ userId, errors: parsed.error.issues }, "Onboarding form data validation failed");
    return { success: false, error: "Niekompletne dane onboardingu" };
  }

  const [markResult, metadataResult] = await Promise.all([
    markOnboardingComplete(userId),
    setUserMetadata(userId, {
      roles: [Role.CONTRACTOR],
      onboardingComplete: true
    })
  ]);

  const [markError] = markResult;
  if (markError) {
    return { success: false, error: "Nie udało się zakończyć onboardingu" };
  }

  const [metadataError] = metadataResult;
  if (metadataError) {
    logger.error({ userId }, "Failed to update user metadata after onboarding");
    return { success: false, error: "Nie udało się zaktualizować profilu" };
  }

  redirect("/onboarding/success");
}

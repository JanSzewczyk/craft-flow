"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Role } from "~/features/auth/constants/roles";
import { setUserMetadata } from "~/features/auth/server/api/set-user-metadata";
import { onboardingFormDataSchema } from "~/features/onboarding/schemas/onboarding-form-data-schema";
import { detectClerkPlan } from "~/features/onboarding/server/api/detect-clerk-plan";
import { getOnboardingState, markOnboardingComplete } from "~/features/onboarding/server/db";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding" });

export async function completeOnboarding(): RedirectAction {
  const { userId, isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const [getError, state] = await getOnboardingState(userId);
  if (getError) {
    return { success: false, error: "Nie znaleziono stanu onboardingu" };
  }

  const planId = await detectClerkPlan();
  const formData = {
    ...state.companyDetails,
    ...state.branding,
    ...state.templateConfig,
    ...state.emailConfig,
    planId
  };
  const parsed = onboardingFormDataSchema.safeParse(formData);
  if (!parsed.success) {
    logger.warn({ userId, errors: parsed.error.issues }, "Onboarding form data validation failed");
    return { success: false, error: "Niekompletne dane onboardingu" };
  }

  const [markError] = await markOnboardingComplete(userId);
  if (markError) {
    return { success: false, error: "Nie udało się zakończyć onboardingu" };
  }

  const [metadataError] = await setUserMetadata(userId, {
    roles: [Role.CONTRACTOR],
    onboardingComplete: true
  });

  if (metadataError) {
    logger.error({ userId }, "Failed to update user metadata after onboarding");
    return { success: false, error: "Nie udało się zaktualizować profilu" };
  }

  redirect("/onboarding/success");
}

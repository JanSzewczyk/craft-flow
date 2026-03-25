"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Role } from "~/features/auth/constants/roles";
import { setUserMetadata } from "~/features/auth/server/api/set-user-metadata";
import { upsertContractorProfile } from "~/features/contractor/server/db";
import { onboardingFormDataSchema } from "~/features/onboarding/schemas/onboarding-form-data-schema";
import { getCachedOnboardingState, markOnboardingComplete } from "~/features/onboarding/server/db";
import { createTemplateWithSteps } from "~/features/templates/server/db";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-actions" });

export async function finalizeOnboardingAction(): RedirectAction {
  const { userId, isAuthenticated } = await auth();
  if (!isAuthenticated) {
    logger.warn({ action: "finalizeOnboarding" }, "Unauthorized access attempt");
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  logger.info({ userId }, "Finalizing onboarding");

  const [getError, state] = await getCachedOnboardingState(userId);
  if (getError) {
    logger.error({ userId, errorCode: getError.code }, "Failed to fetch onboarding state");
    return { success: false, error: "Nie znaleziono stanu onboardingu" };
  }

  const formData = {
    companyDetails: state.companyDetails,
    branding: state.branding,
    templateConfig: state.templateConfig,
    emailConfig: state.emailConfig
  };
  const parsed = onboardingFormDataSchema.safeParse(formData);
  if (!parsed.success) {
    logger.warn({ userId, errors: parsed.error.issues }, "Onboarding form data validation failed");
    return { success: false, error: "Niekompletne dane onboardingu" };
  }

  const { companyDetails, templateConfig, emailConfig, branding } = parsed.data;

  const [profileError] = await upsertContractorProfile(userId, {
    ...companyDetails,
    ...branding,
    defaultEmailMessage: emailConfig?.emailBody,
    defaultEmailSubject: emailConfig?.emailSubject
  });
  if (profileError) {
    logger.error({ userId, errorCode: profileError.code }, "Failed to upsert contractor profile");
    return { success: false, error: "Nie udało się zapisać profilu firmy" };
  }

  if (templateConfig) {
    const [templateError] = await createTemplateWithSteps(userId, {
      name: templateConfig.name,
      description: templateConfig.description,
      steps: templateConfig.steps
    });
    if (templateError) {
      logger.error({ userId, errorCode: templateError.code }, "Failed to create template");
      return { success: false, error: "Nie udało się zapisać szablonu" };
    }
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
    logger.error({ userId, errorCode: markError.code }, "Failed to mark onboarding complete");
    return { success: false, error: "Nie udało się zakończyć onboardingu" };
  }

  const [metadataError] = metadataResult;
  if (metadataError) {
    logger.error({ userId }, "Failed to update user metadata after onboarding");
    return { success: false, error: "Nie udało się zaktualizować profilu" };
  }

  logger.info({ userId }, "Onboarding finalized successfully");
  redirect("/onboarding/success");
}

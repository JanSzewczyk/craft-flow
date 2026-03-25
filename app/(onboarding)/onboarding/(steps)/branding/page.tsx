import { auth } from "@clerk/nextjs/server";
import { StepperContent } from "@szum-tech/design-system";
import { redirect } from "next/navigation";
import { BrandingView } from "~/features/onboarding/components/branding-view";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { type BrandingFormData } from "~/features/onboarding/schemas";
import { deleteLogo } from "~/features/onboarding/server/actions/delete-logo";
import { submitBrandingAction } from "~/features/onboarding/server/actions/submit-branding";
import { uploadLogo } from "~/features/onboarding/server/actions/upload-logo";
import { getCachedOnboardingState } from "~/features/onboarding/server/db";
import { getOnboardingPlanConfig } from "~/features/onboarding/server/services/step-service";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-branding-page" });

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }
  logger.info({ userId }, "Loading onboarding branding page data");

  const config = await getOnboardingPlanConfig(OnboardingStep.BRANDING);
  if (!config) throw new Error("onboarding branding page data is missing");
  if (config.wasRedirected) {
    logger.info({ userId, planId: config.plan.id }, "Plan does not include branding, redirecting");
    redirect(config.currentStep);
  }

  const [onboardingError, onboardingState] = await getCachedOnboardingState(userId);
  if (onboardingError) {
    if (onboardingError.isNotFound) {
      logger.warn({ userId }, "No onboarding state found, redirecting to first step");
      redirect(config.firstStep);
    } else {
      logger.error(
        {
          userId,
          errorCode: onboardingError.code,
          isRetryable: onboardingError.isRetryable
        },
        "Failed to load onboarding data"
      );
      throw onboardingError;
    }
  }

  logger.info({ userId }, "Successfully loaded branding page data");
  return { onboardingState, config };
}

export default async function BrandingPage() {
  const { onboardingState, config } = await loadData();

  async function handleBack() {
    "use server";
    redirect(config.previousStep);
  }

  async function handleSubmitBranding(formData: BrandingFormData) {
    "use server";
    return await submitBrandingAction(formData, onboardingState);
  }

  return (
    <StepperContent value={OnboardingStep.BRANDING}>
      <div className="mb-8 text-center">
        <h1 className="text-heading-h2 text-foreground">Twoja Marka, Twój Styl</h1>
        <p className="text-muted-foreground text-body-sm mt-2">Wgraj logo i wybierz kolor przewodni swojego portalu</p>
      </div>

      <BrandingView
        defaultValues={onboardingState?.branding}
        onContinueAction={handleSubmitBranding}
        uploadLogoAction={uploadLogo}
        deleteLogoAction={deleteLogo}
        onBackAction={handleBack}
      />
    </StepperContent>
  );
}

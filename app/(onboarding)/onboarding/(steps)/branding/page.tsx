import { auth } from "@clerk/nextjs/server";
import { StepperContent } from "@szum-tech/design-system";
import { redirect } from "next/navigation";
import { type BrandingFormData } from "~/features/onboarding";
import { BrandingView } from "~/features/onboarding/components/branding-view";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { planHasBranding } from "~/features/onboarding/constants/plans";
import { deleteLogo } from "~/features/onboarding/server/actions/delete-logo";
import { submitBrandingAction } from "~/features/onboarding/server/actions/submit-branding";
import { uploadLogo } from "~/features/onboarding/server/actions/upload-logo";
import { detectClerkPlan } from "~/features/onboarding/server/api/detect-clerk-plan";
import { getCachedOnboardingState } from "~/features/onboarding/server/db";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-branding-page" });

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }
  logger.info({ userId }, "Loading onboarding branding page data");

  const [onboardingError, onboardingState] = await getCachedOnboardingState(userId);
  if (onboardingError) {
    if (onboardingError.isNotFound) {
      logger.warn({ userId }, "No onboarding state found, redirecting to plans");
      redirect(OnboardingStep.COMPANY_DETAILS);
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

  const planId = await detectClerkPlan();
  if (planId && !planHasBranding(planId)) {
    logger.info({ userId, planId }, "Plan does not include branding, redirecting to template");
    redirect("/onboarding/template");
  }

  logger.info({ userId }, "Successfully loaded branding page data");
  return { onboardingState };
}

export default async function BrandingPage() {
  const { onboardingState } = await loadData();

  async function handleBack() {
    "use server";
    redirect(OnboardingStep.COMPANY_DETAILS);
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

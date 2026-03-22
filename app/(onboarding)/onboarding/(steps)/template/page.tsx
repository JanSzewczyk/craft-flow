import { auth } from "@clerk/nextjs/server";
import { StepperContent } from "@szum-tech/design-system";
import { redirect } from "next/navigation";
import { type TemplateFormData } from "~/features/onboarding";
import { TemplateForm } from "~/features/onboarding/components/forms/template-form";
import { DEFAULT_TEMPLATE_STEPS } from "~/features/onboarding/constants/defaults";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { resolveStepsForPlan } from "~/features/onboarding/constants/resolve-steps";
import { submitTemplateAction } from "~/features/onboarding/server/actions/submit-template";
import { detectClerkPlan } from "~/features/onboarding/server/api/detect-clerk-plan";
import { getCachedOnboardingState } from "~/features/onboarding/server/db";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-template-page" });

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }
  logger.info({ userId }, "Loading onboarding template page data");

  const [onboardingError, onboarding] = await getCachedOnboardingState(userId);
  if (onboardingError && !onboardingError.isNotFound) {
    logger.error(
      {
        userId,
        errorCode: onboardingError.code,
        isRetryable: onboardingError.isRetryable
      },
      "Failed to load onboarding data"
    );
    if (onboardingError.isRetryable) {
      throw onboardingError;
    } else {
      throw new Error("Unable to access onboarding data");
    }
  }

  if (onboardingError?.isNotFound || !onboarding) {
    logger.warn({ userId }, "No onboarding state found, redirecting to plans");
    redirect("/onboarding/plans");
  }

  const planId = await detectClerkPlan();
  if (!planId) {
    logger.warn({ userId }, "No plan detected, redirecting to plans");
    redirect("/onboarding/plans");
  }

  const steps = resolveStepsForPlan(planId);
  const backHref = steps.some((s) => s.id === OnboardingStep.BRANDING)
    ? "/onboarding/branding"
    : "/onboarding/company-details";

  logger.info({ userId }, "Successfully loaded template page data");
  return { onboardingState: onboarding, backHref };
}

export default async function TemplatePage() {
  const { onboardingState, backHref } = await loadData();

  async function handleSubmitTemplate(formData: TemplateFormData) {
    "use server";
    return await submitTemplateAction(formData, onboardingState);
  }

  const templateSteps = onboardingState.templateConfig?.templateSteps ?? DEFAULT_TEMPLATE_STEPS;

  return (
    <StepperContent value={OnboardingStep.TEMPLATE}>
      <div className="mb-8 text-center">
        <h1 className="text-heading-h2 text-foreground">Zdefiniuj swój proces</h1>
        <p className="text-muted-foreground text-body-sm mt-2">Z jakich kroków zazwyczaj składa się Twoje zlecenie?</p>
      </div>

      <TemplateForm defaultValues={{ templateSteps }} onContinueAction={handleSubmitTemplate} backHref={backHref} />
    </StepperContent>
  );
}

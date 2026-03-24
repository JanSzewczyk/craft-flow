import { auth } from "@clerk/nextjs/server";
import { StepperContent } from "@szum-tech/design-system";
import { redirect } from "next/navigation";
import { TemplateForm } from "~/features/onboarding/components/forms/template-form";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { type TemplateFormData } from "~/features/onboarding/schemas";
import { submitTemplateAction } from "~/features/onboarding/server/actions/submit-template";
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

  const [onboardingError, onboardingState] = await getCachedOnboardingState(userId);
  if (onboardingError) {
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

  logger.info({ userId }, "Successfully loaded template page data");
  return { onboardingState };
}

export default async function TemplatePage() {
  const { onboardingState } = await loadData();

  async function handleBack() {
    "use server";
    redirect("/");
  }

  async function handleSubmitTemplate(formData: TemplateFormData) {
    "use server";
    return await submitTemplateAction(formData, onboardingState);
  }

  return (
    <StepperContent value={OnboardingStep.TEMPLATE}>
      <div className="mb-8 text-center">
        <h1 className="text-heading-h2 text-foreground">Zdefiniuj swój proces</h1>
        <p className="text-muted-foreground text-body-sm mt-2">Z jakich kroków zazwyczaj składa się Twoje zlecenie?</p>
      </div>

      <TemplateForm
        defaultValues={onboardingState.templateConfig}
        onContinueAction={handleSubmitTemplate}
        onBackAction={handleBack}
      />
    </StepperContent>
  );
}

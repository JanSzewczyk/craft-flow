import { auth } from "@clerk/nextjs/server";
import { StepperContent } from "@szum-tech/design-system";
import { redirect } from "next/navigation";
import { EmailForm } from "~/features/onboarding/components/forms/email-form";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { type EmailFormData } from "~/features/onboarding/schemas";
import { submitEmailAction } from "~/features/onboarding/server/actions/submit-email";
import { getCachedOnboardingState } from "~/features/onboarding/server/db";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-email-page" });

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }
  logger.info({ userId }, "Loading onboarding email page data");

  const [onboardingError, onboarding] = await getCachedOnboardingState(userId);
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

  logger.info({ userId }, "Successfully loaded email page data");
  return { onboardingState: onboarding };
}

export default async function EmailPage() {
  const { onboardingState } = await loadData();

  async function handleBack() {
    "use server";
    redirect(OnboardingStep.TEMPLATE);
  }

  async function handleSubmitEmail(formData: EmailFormData) {
    "use server";
    return await submitEmailAction(formData, onboardingState);
  }

  return (
    <StepperContent value={OnboardingStep.EMAIL}>
      <div className="mb-8 text-center">
        <h1 className="text-heading-h2 text-foreground">Przywitaj swoich klientów</h1>
        <p className="text-muted-foreground text-body-sm mt-2">
          Ten e-mail zostanie wysłany automatycznie, gdy opublikujesz projekt
        </p>
      </div>

      <EmailForm
        defaultValues={onboardingState.emailConfig}
        onContinueAction={handleSubmitEmail}
        onBackAction={handleBack}
      />
    </StepperContent>
  );
}

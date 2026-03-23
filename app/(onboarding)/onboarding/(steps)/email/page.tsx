import { auth } from "@clerk/nextjs/server";
import { Badge, StepperContent } from "@szum-tech/design-system";
import { redirect } from "next/navigation";
import { type EmailFormData } from "~/features/onboarding";
import { EmailForm } from "~/features/onboarding/components/forms/email-form";
import { DEFAULT_EMAIL_BODY, DEFAULT_EMAIL_SUBJECT } from "~/features/onboarding/constants/defaults";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { submitEmailAction } from "~/features/onboarding/server/actions/submit-email";
import { detectClerkPlan } from "~/features/onboarding/server/api/detect-clerk-plan";
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

  logger.info({ userId }, "Successfully loaded email page data");
  return { onboardingState: onboarding };
}

const placeholders = ["{{clientName}}", "{{projectName}}", "{{companyName}}", "{{date}}"];

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

      <div className="mb-6 flex flex-wrap gap-2">
        <span className="text-body-sm text-muted-foreground">Dostępne zmienne:</span>
        {placeholders.map((p) => (
          <Badge key={p} variant="outline" className="font-mono text-xs">
            {p}
          </Badge>
        ))}
      </div>

      <EmailForm
        defaultValues={{
          emailSubject: onboardingState.emailConfig?.emailSubject ?? DEFAULT_EMAIL_SUBJECT,
          emailBody: onboardingState.emailConfig?.emailBody ?? DEFAULT_EMAIL_BODY
        }}
        onContinueAction={handleSubmitEmail}
        onBackAction={handleBack}
      />
    </StepperContent>
  );
}

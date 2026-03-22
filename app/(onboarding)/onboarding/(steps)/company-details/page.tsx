import { auth } from "@clerk/nextjs/server";
import { StepperContent } from "@szum-tech/design-system";
import { notFound, redirect } from "next/navigation";
import { type CompanyDetailsFormData } from "~/features/onboarding";
import { CompanyDetailsForm } from "~/features/onboarding/components/forms/company-details-form";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { submitCompanyDetailsAction } from "~/features/onboarding/server/actions/submit-company-details";
import { createOnboardingState, getCachedOnboardingState } from "~/features/onboarding/server/db";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-company-details-page" });

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }
  logger.info({ userId }, "Loading onboarding company-details page data");

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

  let onboardingData = onboarding;

  if (onboardingError && onboardingError.isNotFound) {
    const [error, createdOnboarding] = await createOnboardingState(userId, OnboardingStep.COMPANY_DETAILS);
    if (error) {
      logger.error(
        {
          userId,
          errorCode: error.code,
          isRetryable: error.isRetryable
        },
        "Failed to create onboarding state for new user"
      );
      throw error;
    }

    onboardingData = createdOnboarding;
  }

  if (!onboardingData) {
    logger.error({ userId }, "Onboarding data is null after handling not found case");
    notFound();
  }

  logger.info(
    {
      userId
    },
    "Successfully loaded page data"
  );
  return { onboardingState: onboardingData };
}

export default async function CompanyDetailsPage() {
  const { onboardingState } = await loadData();

  async function handleSubmitBudgetConfiguration(formData: CompanyDetailsFormData) {
    "use server";
    return await submitCompanyDetailsAction(formData, onboardingState);
  }

  return (
    <StepperContent value={OnboardingStep.COMPANY_DETAILS}>
      <div className="mb-8 text-center">
        <h1 className="text-heading-h2 text-foreground">Opowiedz nam o swoim warsztacie</h1>
        <p className="text-muted-foreground text-body-sm mt-2">
          Te dane pojawią się na Twoich fakturach i w portalu klienta
        </p>
      </div>

      <CompanyDetailsForm
        defaultValues={onboardingState.companyDetails}
        onContinueAction={handleSubmitBudgetConfiguration}
      />
    </StepperContent>
  );
}

import { auth } from "@clerk/nextjs/server";
import { StepperContent } from "@szum-tech/design-system";
import { redirect } from "next/navigation";
import { OnboardingSummary } from "~/features/onboarding/components/onboarding-summary";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { finalizeOnboardingAction } from "~/features/onboarding/server/actions/finalize-onboarding";
import { getCachedOnboardingState } from "~/features/onboarding/server/db";
import { getOnboardingPlanConfig } from "~/features/onboarding/server/services/step-service";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-summary-page" });

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }
  logger.info({ userId }, "Loading onboarding summary page data");

  const config = await getOnboardingPlanConfig(OnboardingStep.SUMMARY);
  if (!config) throw new Error("onboarding summary page data is missing");

  const [onboardingError, onboarding] = await getCachedOnboardingState({ contractorId: userId });
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

  logger.info({ userId }, "Successfully loaded summary page data");
  return { onboardingState: onboarding, config };
}

export default async function SummaryPage() {
  const { onboardingState, config } = await loadData();

  async function handleBack() {
    "use server";
    redirect(config.previousStep);
  }

  async function handleFinalize() {
    "use server";
    return await finalizeOnboardingAction();
  }

  return (
    <StepperContent value={OnboardingStep.SUMMARY}>
      <div className="mb-12">
        <h1 className="text-heading-h1 text-foreground">Podsumowanie konfiguracji</h1>
        <p className="text-muted-foreground text-body-lg mt-2">
          Sprawdź czy wszystko się zgadza przed uruchomieniem projektu.
        </p>
      </div>

      <OnboardingSummary
        plan={config.plan}
        onboardingState={onboardingState}
        planFeatures={config.features}
        onFinalizeAction={handleFinalize}
        onBackAction={handleBack}
      />
    </StepperContent>
  );
}

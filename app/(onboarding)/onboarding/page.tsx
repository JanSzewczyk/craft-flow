import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { getOnboardingState } from "~/features/onboarding/server/db";
import { getOnboardingPlanConfig } from "~/features/onboarding/server/services/step-service";

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) redirect("/sign-in");

  const [error, state] = await getOnboardingState(userId);

  if (error) {
    const config = await getOnboardingPlanConfig(OnboardingStep.COMPANY_DETAILS);
    redirect(config ? config.firstStep : "/onboarding/plans");
  }

  return state.currentStep;
}

export default async function OnboardingPage() {
  const currentStep = await loadData();

  redirect(currentStep);
}

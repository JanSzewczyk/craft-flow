import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { detectClerkPlan } from "~/features/onboarding/server/api/detect-clerk-plan";
import { getOnboardingState } from "~/features/onboarding/server/api/onboarding-state-service";

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) redirect("/sign-in");

  const [error, state] = await getOnboardingState(userId);

  if (error) {
    const plan = await detectClerkPlan();
    redirect(plan ? "/onboarding/company-details" : "/onboarding/plans");
  }

  return state.currentStep;
}

export default async function OnboardingPage() {
  const currentStep = await loadData();

  redirect(currentStep);
}

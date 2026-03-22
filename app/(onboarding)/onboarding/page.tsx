import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { detectClerkPlan } from "~/features/onboarding/server/api/detect-clerk-plan";
import { getOnboardingState } from "~/features/onboarding/server/api/onboarding-state-service";

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) redirect("/sign-in");

  const [error, state] = await getOnboardingState(userId);

  if (error || !state) {
    const plan = await detectClerkPlan();
    redirect(plan ? "/onboarding/company-details" : "/onboarding/plans");
  }

  const stepPaths: Record<string, string> = {
    [OnboardingStep.PLANS]: "/onboarding/plans",
    [OnboardingStep.COMPANY_DETAILS]: "/onboarding/company-details",
    [OnboardingStep.BRANDING]: "/onboarding/branding",
    [OnboardingStep.TEMPLATE]: "/onboarding/template",
    [OnboardingStep.EMAIL]: "/onboarding/email"
  };

  const targetPath = stepPaths[state.currentStep] ?? "/onboarding/plans";

  return { targetPath };
}

export default async function OnboardingPage() {
  const { targetPath } = await loadData();

  redirect(targetPath);
}

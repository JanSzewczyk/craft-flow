import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingSuccess } from "~/features/onboarding/components/onboarding-success";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { getOnboardingState } from "~/features/onboarding/server/db";
import { getOnboardingPlanConfig } from "~/features/onboarding/server/services/step-service";

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) redirect("/sign-in");

  const [error, state] = await getOnboardingState(userId);
  if (error || !state.completed) redirect("/onboarding");

  const config = await getOnboardingPlanConfig(OnboardingStep.COMPANY_DETAILS);
  const companyName = state.companyDetails?.companyName ?? "";
  const templateSteps = state.templateConfig?.steps ?? [];
  const hasBranding = !!(state.branding?.logoUrl || state.branding?.brandColor);

  return { planName: config?.plan.name ?? "Basic", companyName, hasBranding, templateSteps };
}

export default async function SuccessPage() {
  const { planName, companyName, hasBranding, templateSteps } = await loadData();

  return (
    <OnboardingSuccess
      planName={planName}
      companyName={companyName}
      hasBranding={hasBranding}
      templateCount={templateSteps.length}
    />
  );
}

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingSuccess } from "~/features/onboarding/components/onboarding-success";
import { PLANS } from "~/features/onboarding/constants/plans";
import { detectClerkPlan } from "~/features/onboarding/server/api/detect-clerk-plan";
import { getOnboardingState } from "~/features/onboarding/server/db";

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) redirect("/sign-in");

  const [error, state] = await getOnboardingState(userId);
  if (error || !state.completed) redirect("/onboarding");

  const planId = await detectClerkPlan();
  const plan = PLANS.find((p) => p.id === planId);
  const companyName = state.companyDetails?.companyName ?? "";
  const templateSteps = state.templateConfig?.templateSteps ?? [];
  const hasBranding = !!(state.branding?.logoUrl || state.branding?.brandColor);

  return { plan, companyName, hasBranding, templateSteps };
}

export default async function SuccessPage() {
  const { plan, companyName, hasBranding, templateSteps } = await loadData();

  return (
    <OnboardingSuccess
      planName={plan?.name ?? "Basic"}
      companyName={companyName}
      hasBranding={hasBranding}
      templateCount={templateSteps.length}
    />
  );
}

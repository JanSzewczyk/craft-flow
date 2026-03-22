import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BrandingForm } from "~/features/onboarding/components/forms/branding-form";
import { OnboardingStepper } from "~/features/onboarding/components/onboarding-stepper";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { type Plan, planHasBranding } from "~/features/onboarding/constants/plans";
import { resolveStepsForPlan } from "~/features/onboarding/constants/resolve-steps";
import { getOnboardingState } from "~/features/onboarding/server/api/onboarding-state-service";

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) redirect("/sign-in");

  const [error, state] = await getOnboardingState(userId);
  if (error || !state) redirect("/onboarding/plans");

  const formData = state.formData as Record<string, unknown>;
  const planId = formData["planId"] as Plan | undefined;
  if (!planId) redirect("/onboarding/plans");

  if (!planHasBranding(planId)) {
    redirect("/onboarding/template");
  }

  const steps = resolveStepsForPlan(planId);

  return { formData, steps };
}

export default async function BrandingPage() {
  const { formData, steps } = await loadData();

  return (
    <div>
      <OnboardingStepper steps={steps} currentStepId={OnboardingStep.BRANDING} />
      <BrandingForm
        defaultValues={{
          logoUrl: (formData["logoUrl"] as string) ?? null,
          brandColor: (formData["brandColor"] as string) ?? "#10B981"
        }}
      />
    </div>
  );
}

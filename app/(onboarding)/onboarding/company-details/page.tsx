import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CompanyDetailsForm } from "~/features/onboarding/components/forms/company-details-form";
import { OnboardingStepper } from "~/features/onboarding/components/onboarding-stepper";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { type Plan } from "~/features/onboarding/constants/plans";
import { resolveStepsForPlan } from "~/features/onboarding/constants/resolve-steps";
import { detectClerkPlan } from "~/features/onboarding/server/api/detect-clerk-plan";
import { getOnboardingState, upsertOnboardingState } from "~/features/onboarding/server/api/onboarding-state-service";

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) redirect("/sign-in");

  const [error, state] = await getOnboardingState(userId);

  let formData: Record<string, unknown> = {};
  let planId: Plan | undefined;

  if (error || !state) {
    const detectedPlan = await detectClerkPlan();
    if (!detectedPlan) redirect("/onboarding/plans");

    planId = detectedPlan;
    formData = { planId };

    await upsertOnboardingState(userId, OnboardingStep.COMPANY_DETAILS, formData);
  } else {
    formData = state.formData as Record<string, unknown>;
    planId = formData["planId"] as Plan | undefined;
    if (!planId) redirect("/onboarding/plans");
  }

  const steps = resolveStepsForPlan(planId);
  const nextStep = steps[1]?.id ?? OnboardingStep.TEMPLATE;

  return { formData, planId, steps, nextStep };
}

export default async function CompanyDetailsPage() {
  const { formData, steps, nextStep } = await loadData();

  return (
    <div>
      <OnboardingStepper steps={steps} currentStepId={OnboardingStep.COMPANY_DETAILS} />
      <CompanyDetailsForm
        defaultValues={{
          companyName: (formData["companyName"] as string) ?? "",
          industry: (formData["industry"] as string) ?? ""
        }}
        nextStep={nextStep}
      />
    </div>
  );
}

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TemplateForm } from "~/features/onboarding/components/forms/template-form";
import { OnboardingStepper } from "~/features/onboarding/components/onboarding-stepper";
import { DEFAULT_TEMPLATE_STEPS } from "~/features/onboarding/constants/defaults";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { type Plan } from "~/features/onboarding/constants/plans";
import { resolveStepsForPlan } from "~/features/onboarding/constants/resolve-steps";
import { getOnboardingState } from "~/features/onboarding/server/api/onboarding-state-service";

export default async function TemplatePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [error, state] = await getOnboardingState(userId);
  if (error || !state) redirect("/onboarding/plans");

  const formData = state.formData as Record<string, unknown>;
  const planId = formData["planId"] as Plan | undefined;
  if (!planId) redirect("/onboarding/plans");

  const steps = resolveStepsForPlan(planId);
  const templateSteps = (formData["templateSteps"] as string[] | undefined) ?? DEFAULT_TEMPLATE_STEPS;

  return (
    <div>
      <OnboardingStepper steps={steps} currentStepId={OnboardingStep.TEMPLATE} />
      <TemplateForm
        defaultValues={{ templateSteps }}
        backHref={steps.some((s) => s.id === "branding") ? "/onboarding/branding" : "/onboarding/company-details"}
      />
    </div>
  );
}

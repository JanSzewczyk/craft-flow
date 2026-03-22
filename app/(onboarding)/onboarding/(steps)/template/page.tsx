import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TemplateForm } from "~/features/onboarding/components/forms/template-form";
import { DEFAULT_TEMPLATE_STEPS } from "~/features/onboarding/constants/defaults";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { type Plan } from "~/features/onboarding/constants/plans";
import { resolveStepsForPlan } from "~/features/onboarding/constants/resolve-steps";
import { saveStepAndRedirect } from "~/features/onboarding/server/actions/save-step-and-redirect";
import { getCachedOnboardingState } from "~/features/onboarding/server/api/onboarding-state-service";

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) redirect("/sign-in");

  const [error, state] = await getCachedOnboardingState(userId);
  if (error) redirect("/onboarding/plans");

  const formData = state.formData as Record<string, unknown>;
  const planId = formData["planId"] as Plan | undefined;
  if (!planId) redirect("/onboarding/plans");

  const steps = resolveStepsForPlan(planId);
  const templateSteps = (formData["templateSteps"] as string[] | undefined) ?? DEFAULT_TEMPLATE_STEPS;
  const backHref = steps.some((s) => s.id === "branding") ? "/onboarding/branding" : "/onboarding/company-details";

  return { templateSteps, backHref };
}

export default async function TemplatePage() {
  const { templateSteps, backHref } = await loadData();

  const action = saveStepAndRedirect.bind(null, OnboardingStep.TEMPLATE, OnboardingStep.EMAIL);

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-heading-h2 text-foreground">Zdefiniuj swój proces</h1>
        <p className="text-muted-foreground text-body-sm mt-2">Z jakich kroków zazwyczaj składa się Twoje zlecenie?</p>
      </div>

      <TemplateForm defaultValues={{ templateSteps }} action={action} backHref={backHref} />
    </div>
  );
}

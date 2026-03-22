import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { EmailForm } from "~/features/onboarding/components/forms/email-form";
import { OnboardingStepper } from "~/features/onboarding/components/onboarding-stepper";
import { DEFAULT_EMAIL_BODY, DEFAULT_EMAIL_SUBJECT } from "~/features/onboarding/constants/defaults";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { type Plan } from "~/features/onboarding/constants/plans";
import { resolveStepsForPlan } from "~/features/onboarding/constants/resolve-steps";
import { getOnboardingState } from "~/features/onboarding/server/api/onboarding-state-service";

export default async function EmailPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [error, state] = await getOnboardingState(userId);
  if (error || !state) redirect("/onboarding/plans");

  const formData = state.formData as Record<string, unknown>;
  const planId = formData["planId"] as Plan | undefined;
  if (!planId) redirect("/onboarding/plans");

  const steps = resolveStepsForPlan(planId);

  return (
    <div>
      <OnboardingStepper steps={steps} currentStepId={OnboardingStep.EMAIL} />
      <EmailForm
        defaultValues={{
          emailSubject: (formData["emailSubject"] as string) ?? DEFAULT_EMAIL_SUBJECT,
          emailBody: (formData["emailBody"] as string) ?? DEFAULT_EMAIL_BODY
        }}
      />
    </div>
  );
}

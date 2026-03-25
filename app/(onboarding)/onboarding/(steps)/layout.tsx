import * as React from "react";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingStepper } from "~/features/onboarding/components/onboarding-stepper";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { getOnboardingPlanConfig } from "~/features/onboarding/server/services/step-service";

async function loadData() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) redirect("/sign-in");

  const config = await getOnboardingPlanConfig(OnboardingStep.COMPANY_DETAILS);
  if (!config) redirect("/onboarding/plans");

  return { steps: config.steps };
}

export default async function StepsLayout({ children }: LayoutProps<"/onboarding">) {
  const { steps } = await loadData();

  return <OnboardingStepper steps={steps}>{children}</OnboardingStepper>;
}

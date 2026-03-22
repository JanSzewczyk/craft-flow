import * as React from "react";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingStepper } from "~/features/onboarding/components/onboarding-stepper";
import { type Plan } from "~/features/onboarding/constants/plans";
import { resolveStepsForPlan } from "~/features/onboarding/constants/resolve-steps";
import { detectClerkPlan } from "~/features/onboarding/server/api/detect-clerk-plan";
import { getCachedOnboardingState } from "~/features/onboarding/server/db";

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) redirect("/sign-in");

  const [, state] = await getCachedOnboardingState(userId);

  const planId = await detectClerkPlan();
  if (!planId) redirect("/onboarding/plans");

  // return resolveStepsForPlan(planId);
}

export default async function StepsLayout({ children }: LayoutProps<"/onboarding">) {
  await loadData();

  return <OnboardingStepper>{children}</OnboardingStepper>;
}

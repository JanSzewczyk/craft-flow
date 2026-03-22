import { ONBOARDING_STEPS, OnboardingStep, type StepConfig } from "./onboarding-steps";
import { type Plan, planHasBranding } from "./plans";

export function resolveStepsForPlan(planId: Plan): StepConfig[] {
  const hasBranding = planHasBranding(planId);

  return ONBOARDING_STEPS.filter((step) => {
    if (step.isConditional && step.id === OnboardingStep.BRANDING) {
      return hasBranding;
    }
    return true;
  });
}

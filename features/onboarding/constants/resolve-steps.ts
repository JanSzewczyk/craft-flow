import { ONBOARDING_STEPS, type StepConfig } from "./onboarding-steps";
import { type Plan, planHasBranding } from "./plans";

export function resolveStepsForPlan(planId: Plan): StepConfig[] {
  const hasBranding = planHasBranding(planId);

  return ONBOARDING_STEPS.filter((step) => {
    if (step.isConditional && step.id === "branding") {
      return hasBranding;
    }
    return true;
  });
}

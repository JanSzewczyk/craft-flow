import "server-only";

import { type Plan } from "~/features/billing";
import { canUseWhitelabelEmails, detectClerkPlan, getPlanById, planHasBranding } from "~/features/billing/server";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";

type FirstOnboardingStep = typeof OnboardingStep.COMPANY_DETAILS;
type LastOnboardingStep = typeof OnboardingStep.EMAIL;
type MiddleOnboardingStep = typeof OnboardingStep.BRANDING | typeof OnboardingStep.TEMPLATE;

export type StepConfig = {
  step: OnboardingStep;
  label: string;
};

export type PlanFeatures = {
  branding: boolean;
  whitelabelEmails: boolean;
};

type BaseOnboardingPlanConfig = {
  plan: Plan;
  features: PlanFeatures;
  currentStep: OnboardingStep;
  /** The step the user requested — may differ from `currentStep` if it was redirected. */
  requestedStep: OnboardingStep;
  /** `true` when `requestedStep` was not active for this plan and got corrected. */
  wasRedirected: boolean;
  steps: StepConfig[];
  firstStep: OnboardingStep;
  lastStep: OnboardingStep;
  isStepActive: (step: OnboardingStep) => boolean;
};

type FirstStepConfig = BaseOnboardingPlanConfig & {
  previousStep: null;
  nextStep: OnboardingStep;
};

type LastStepConfig = BaseOnboardingPlanConfig & {
  nextStep: null;
  previousStep: OnboardingStep;
};

type MiddleStepConfig = BaseOnboardingPlanConfig & {
  nextStep: OnboardingStep;
  previousStep: OnboardingStep;
};

export type OnboardingPlanConfig = FirstStepConfig | LastStepConfig | MiddleStepConfig;

/**
 * All possible onboarding steps in order.
 * Steps with a `condition` are included only when the condition returns true.
 */
const STEP_PIPELINE: readonly (StepConfig & { condition?: (features: PlanFeatures) => boolean })[] = [
  { step: OnboardingStep.COMPANY_DETAILS, label: "Firma" },
  { step: OnboardingStep.BRANDING, label: "Branding", condition: (f) => f.branding },
  { step: OnboardingStep.TEMPLATE, label: "Szablony" },
  { step: OnboardingStep.EMAIL, label: "E-mail" }
];

/** Index of a step in the full (unfiltered) pipeline — used for fallback resolution. */
const PIPELINE_ORDER = new Map(STEP_PIPELINE.map((entry, i) => [entry.step, i]));

function resolveActiveSteps(features: PlanFeatures): StepConfig[] {
  return STEP_PIPELINE.filter((entry) => !entry.condition || entry.condition(features)).map(({ step, label }) => ({
    step,
    label
  }));
}

/**
 * When the requested step is not active, find the closest preceding active step.
 * Falls back to the first active step if nothing precedes it.
 */
function resolveClosestActiveStep(requestedStep: OnboardingStep, activeSteps: StepConfig[]): OnboardingStep {
  const requestedOrder = PIPELINE_ORDER.get(requestedStep) ?? 0;

  // Walk active steps in reverse — first one whose pipeline order is <= requested wins.
  for (let i = activeSteps.length - 1; i >= 0; i--) {
    const activeOrder = PIPELINE_ORDER.get(activeSteps[i]!.step) ?? 0;
    if (activeOrder <= requestedOrder) {
      return activeSteps[i]!.step;
    }
  }

  return activeSteps[0]!.step;
}

/**
 * Detects the user's Clerk plan and returns full onboarding configuration
 * for the given `currentStep`.
 *
 * If `currentStep` is not active for the plan (e.g. branding on Basic),
 * `currentStep` is corrected to the closest preceding active step
 * and `wasRedirected` is set to `true`.
 *
 * Returns `null` when the user has no active plan.
 */
export async function getOnboardingPlanConfig(currentStep: FirstOnboardingStep): Promise<FirstStepConfig | null>;
export async function getOnboardingPlanConfig(currentStep: LastOnboardingStep): Promise<LastStepConfig | null>;
export async function getOnboardingPlanConfig(currentStep: MiddleOnboardingStep): Promise<MiddleStepConfig | null>;
export async function getOnboardingPlanConfig(currentStep: OnboardingStep): Promise<OnboardingPlanConfig | null>;
export async function getOnboardingPlanConfig(currentStep: OnboardingStep): Promise<OnboardingPlanConfig | null> {
  const planId = await detectClerkPlan();
  if (!planId) return null;

  const plan = getPlanById(planId);
  if (!plan) return null;

  const features: PlanFeatures = {
    branding: planHasBranding(planId),
    whitelabelEmails: canUseWhitelabelEmails(planId)
  };

  const steps = resolveActiveSteps(features);
  const stepIndex = new Map(steps.map((s, i) => [s.step, i]));

  const isActive = stepIndex.has(currentStep);
  const resolvedStep = isActive ? currentStep : resolveClosestActiveStep(currentStep, steps);
  const resolvedIdx = stepIndex.get(resolvedStep)!;

  return {
    plan,
    features,
    currentStep: resolvedStep,
    requestedStep: currentStep,
    wasRedirected: !isActive,
    steps,
    firstStep: steps[0]!.step,
    lastStep: steps[steps.length - 1]!.step,
    nextStep: resolvedIdx < steps.length - 1 ? steps[resolvedIdx + 1]!.step : null,
    previousStep: resolvedIdx > 0 ? steps[resolvedIdx - 1]!.step : null,

    isStepActive(step: OnboardingStep): boolean {
      return stepIndex.has(step);
    }
  } as OnboardingPlanConfig;
}

export const OnboardingStep = {
  PLANS: "/onboarding/plans",
  COMPANY_DETAILS: "/onboarding/company-details",
  BRANDING: "/onboarding/branding",
  TEMPLATE: "/onboarding/template",
  EMAIL: "/onboarding/email"
} as const;

export type OnboardingStep = (typeof OnboardingStep)[keyof typeof OnboardingStep];

export type StepConfig = {
  id: OnboardingStep;
  label: string;
  isConditional: boolean;
};

export const ONBOARDING_STEPS: StepConfig[] = [
  { id: OnboardingStep.COMPANY_DETAILS, label: "", isConditional: false },
  { id: OnboardingStep.BRANDING, label: "Branding", isConditional: true },
  { id: OnboardingStep.TEMPLATE, label: "Szablony", isConditional: false },
  { id: OnboardingStep.EMAIL, label: "E-mail", isConditional: false }
];

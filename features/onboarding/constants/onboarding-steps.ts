export const OnboardingStep = {
  PLANS: "plans",
  COMPANY_DETAILS: "company-details",
  BRANDING: "branding",
  TEMPLATE: "template",
  EMAIL: "email"
} as const;

export type OnboardingStep = (typeof OnboardingStep)[keyof typeof OnboardingStep];

export type StepConfig = {
  id: OnboardingStep;
  path: string;
  label: string;
  isConditional: boolean;
};

export const ONBOARDING_STEPS: StepConfig[] = [
  { id: OnboardingStep.COMPANY_DETAILS, path: "/onboarding/company-details", label: "Firma", isConditional: false },
  { id: OnboardingStep.BRANDING, path: "/onboarding/branding", label: "Branding", isConditional: true },
  { id: OnboardingStep.TEMPLATE, path: "/onboarding/template", label: "Szablony", isConditional: false },
  { id: OnboardingStep.EMAIL, path: "/onboarding/email", label: "E-mail", isConditional: false }
];

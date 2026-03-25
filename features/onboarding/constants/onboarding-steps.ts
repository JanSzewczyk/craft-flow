export const OnboardingStep = {
  PLANS: "/onboarding/plans",
  COMPANY_DETAILS: "/onboarding/company-details",
  BRANDING: "/onboarding/branding",
  TEMPLATE: "/onboarding/template",
  EMAIL: "/onboarding/email",
  SUMMARY: "/onboarding/summary"
} as const;

export type OnboardingStep = (typeof OnboardingStep)[keyof typeof OnboardingStep];

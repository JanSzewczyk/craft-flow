// Components
export { OnboardingStepper } from "./components/onboarding-stepper";
export { OnboardingSuccess } from "./components/onboarding-success";
export { CompanyDetailsForm } from "./components/forms/company-details-form";
export { BrandingForm } from "./components/forms/branding-form";
export { BrandingPreview } from "./components/branding-preview";
export { BrandingView } from "./components/branding-view";
export { PhoneMockup } from "./components/phone-mockup";
export { TemplateForm } from "./components/forms/template-form";
export { EmailForm } from "./components/forms/email-form";

// Constants
export { OnboardingStep } from "./constants/onboarding-steps";
export { Plan, PLANS, planHasBranding, type PlanConfig } from "./constants/plans";
export { INDUSTRIES, type Industry } from "./constants/industries";
export { BRAND_COLOR_PRESETS, DEFAULT_BRAND_COLOR } from "./constants/branding-colors";
export { DEFAULT_TEMPLATE_STEPS, DEFAULT_EMAIL_SUBJECT, DEFAULT_EMAIL_BODY } from "./constants/defaults";

// Schemas
export { planSelectionSchema, type PlanSelectionFormData } from "./schemas/plan-selection-schema";
export { companyDetailsSchema, type CompanyDetailsFormData } from "./schemas/company-details-schema";
export { brandingSchema, type BrandingFormData } from "./schemas/branding-schema";
export { templateSchema, type TemplateFormData } from "./schemas/template-schema";
export { emailSchema, type EmailFormData } from "./schemas/email-schema";
export { onboardingFormDataSchema, type OnboardingFormData } from "./schemas/onboarding-form-data-schema";

// Server actions
export { submitCompanyDetailsAction } from "./server/actions/submit-company-details";
export { submitBrandingAction } from "./server/actions/submit-branding";
export { submitTemplateAction } from "./server/actions/submit-template";
export { submitEmailAction } from "./server/actions/submit-email";
export { completeOnboarding } from "./server/actions/complete-onboarding";
export { uploadLogo } from "./server/actions/upload-logo";
export { deleteLogo } from "./server/actions/delete-logo";

// Server API
export { getCachedOnboardingState } from "./server/db";

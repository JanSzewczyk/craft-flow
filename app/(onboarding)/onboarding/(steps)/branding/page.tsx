import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BrandingForm } from "~/features/onboarding/components/forms/branding-form";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { type Plan, planHasBranding } from "~/features/onboarding/constants/plans";
import { saveStepAndRedirect } from "~/features/onboarding/server/actions/save-step-and-redirect";
import { uploadLogo } from "~/features/onboarding/server/actions/upload-logo";
import { getCachedOnboardingState } from "~/features/onboarding/server/api/onboarding-state-service";

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) redirect("/sign-in");

  const [error, state] = await getCachedOnboardingState(userId);
  if (error) redirect("/onboarding/plans");

  const formData = state.formData as Record<string, unknown>;
  const planId = formData["planId"] as Plan | undefined;
  if (!planId) redirect("/onboarding/plans");

  if (!planHasBranding(planId)) {
    redirect("/onboarding/template");
  }

  return { formData };
}

export default async function BrandingPage() {
  const { formData } = await loadData();

  const action = saveStepAndRedirect.bind(null, OnboardingStep.BRANDING, OnboardingStep.TEMPLATE);

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-heading-h2 text-foreground">Twoja Marka, Twój Styl</h1>
        <p className="text-muted-foreground text-body-sm mt-2">Wgraj logo i wybierz kolor przewodni swojego portalu</p>
      </div>

      <BrandingForm
        defaultValues={{
          logoUrl: (formData["logoUrl"] as string) ?? null,
          brandColor: (formData["brandColor"] as string) ?? "#10B981"
        }}
        action={action}
        uploadLogoAction={uploadLogo}
        backHref="/onboarding/company-details"
      />
    </div>
  );
}

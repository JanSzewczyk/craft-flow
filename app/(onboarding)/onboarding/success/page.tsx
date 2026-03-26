import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingSuccess } from "~/features/onboarding/components/onboarding-success";
import { getOnboardingState } from "~/features/onboarding/server/db";
import { getOnboardingPlanConfig } from "~/features/onboarding/server/services/step-service";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-success-page" });

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) redirect("/sign-in");

  const config = await getOnboardingPlanConfig();
  if (!config) throw new Error("onboarding branding page data is missing");

  const [error, state] = await getOnboardingState(userId);
  if (error) {
    logger.error(
      {
        userId,
        errorCode: error.code,
        isRetryable: error.isRetryable
      },
      "Failed to load onboarding data"
    );
    throw error;
  }
  if (!state.completed) redirect("/onboarding");

  const companyName = state.companyDetails?.companyName ?? "";
  const templateSteps = state.templateConfig?.steps ?? [];
  const hasBranding = !!(state.branding?.logoUrl || state.branding?.brandColor);
  const hasEmail = !!state.emailConfig;

  return { plan: config.plan, features: config.features, companyName, hasBranding, hasEmail, templateSteps };
}

export default async function SuccessPage() {
  const { plan, features, companyName, hasBranding, hasEmail, templateSteps } = await loadData();

  return (
    <OnboardingSuccess
      plan={plan}
      features={features}
      companyName={companyName}
      hasBranding={hasBranding}
      hasEmail={hasEmail}
      templateCount={templateSteps.length}
    />
  );
}

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingSuccess } from "~/features/onboarding/components/onboarding-success";
import { PLANS } from "~/features/onboarding/constants/plans";
import { getOnboardingState } from "~/features/onboarding/server/api/onboarding-state-service";

export default async function SuccessPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [error, state] = await getOnboardingState(userId);
  if (error || !state || !state.completed) redirect("/onboarding");

  const formData = state.formData as Record<string, unknown>;
  const plan = PLANS.find((p) => p.id === formData["planId"]);
  const companyName = (formData["companyName"] as string) ?? "";
  const templateSteps = (formData["templateSteps"] as string[]) ?? [];
  const hasBranding = !!(formData["logoUrl"] || formData["brandColor"]);

  return (
    <OnboardingSuccess
      planName={plan?.name ?? "Basic"}
      companyName={companyName}
      hasBranding={hasBranding}
      templateCount={templateSteps.length}
    />
  );
}

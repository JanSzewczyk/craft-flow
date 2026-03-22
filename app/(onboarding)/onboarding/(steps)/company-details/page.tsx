import { auth } from "@clerk/nextjs/server";
import { StepperContent } from "@szum-tech/design-system";
import { redirect } from "next/navigation";
import { type CompanyDetailsFormData } from "~/features/onboarding";
import { CompanyDetailsForm } from "~/features/onboarding/components/forms/company-details-form";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { getCachedOnboardingState } from "~/features/onboarding/server/api/onboarding-state-service";
import { submitCompanyDetailsAction } from "~/features/onboarding/server/actions/submit-company-details";

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) redirect("/sign-in");

  const [, state] = await getCachedOnboardingState(userId);

  return { formData: state?.formData ?? null };
}

export default async function CompanyDetailsPage() {
  const { formData } = await loadData();

  async function handleSubmitBudgetConfiguration(formData: CompanyDetailsFormData) {
    "use server";
    return await submitCompanyDetailsAction(formData);
  }

  return (
    <StepperContent value={OnboardingStep.COMPANY_DETAILS}>
      <div className="mb-8 text-center">
        <h1 className="text-heading-h2 text-foreground">Opowiedz nam o swoim warsztacie</h1>
        <p className="text-muted-foreground text-body-sm mt-2">
          Te dane pojawią się na Twoich fakturach i w portalu klienta
        </p>
      </div>

      <CompanyDetailsForm
        // defaultValues={{
        //   companyName: formData?["companyName"],
        //   industry: formData?["industry"]
        // }}
        onContinueAction={handleSubmitBudgetConfiguration}
      />
    </StepperContent>
  );
}

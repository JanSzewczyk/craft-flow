import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Badge } from "@szum-tech/design-system";
import { EmailForm } from "~/features/onboarding/components/forms/email-form";
import { DEFAULT_EMAIL_BODY, DEFAULT_EMAIL_SUBJECT } from "~/features/onboarding/constants/defaults";
import { type Plan } from "~/features/onboarding/constants/plans";
import { saveStepAndComplete } from "~/features/onboarding/server/actions/save-step-and-complete";
import { getCachedOnboardingState } from "~/features/onboarding/server/api/onboarding-state-service";

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) redirect("/sign-in");

  const [error, state] = await getCachedOnboardingState(userId);
  if (error) redirect("/onboarding/plans");

  const formData = state.formData as Record<string, unknown>;
  const planId = formData["planId"] as Plan | undefined;
  if (!planId) redirect("/onboarding/plans");

  return { formData };
}

const placeholders = ["{{clientName}}", "{{projectName}}", "{{companyName}}", "{{date}}"];

export default async function EmailPage() {
  const { formData } = await loadData();

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-heading-h2 text-foreground">Przywitaj swoich klientów</h1>
        <p className="text-muted-foreground text-body-sm mt-2">
          Ten e-mail zostanie wysłany automatycznie, gdy opublikujesz projekt
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <span className="text-body-sm text-muted-foreground">Dostępne zmienne:</span>
        {placeholders.map((p) => (
          <Badge key={p} variant="outline" className="font-mono text-xs">
            {p}
          </Badge>
        ))}
      </div>

      <EmailForm
        defaultValues={{
          emailSubject: (formData["emailSubject"] as string) ?? DEFAULT_EMAIL_SUBJECT,
          emailBody: (formData["emailBody"] as string) ?? DEFAULT_EMAIL_BODY
        }}
        action={saveStepAndComplete}
        backHref="/onboarding/template"
      />
    </div>
  );
}

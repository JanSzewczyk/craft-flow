"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Badge, Field, FieldError, FieldGroup, FieldLabel, Input, Textarea, toast } from "@szum-tech/design-system";
import { StepNavigation } from "~/features/onboarding/components/step-navigation";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { emailSchema, type EmailFormData } from "~/features/onboarding/schemas/email-schema";
import { completeOnboarding } from "~/features/onboarding/server/actions/complete-onboarding";
import { saveStep } from "~/features/onboarding/server/actions/save-step";

type EmailFormProps = {
  defaultValues: EmailFormData;
};

export function EmailForm({ defaultValues }: EmailFormProps) {
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues
  });

  async function handleSubmit(data: EmailFormData) {
    // First save the email step data
    const saveResult = await saveStep(OnboardingStep.EMAIL, OnboardingStep.EMAIL, data);
    if (!saveResult.success) {
      toast.error("Błąd", { description: saveResult.error });
      return;
    }

    // Then complete the onboarding
    const result = await completeOnboarding();
    if (!result.success) {
      toast.error("Błąd", { description: result.error });
    }
  }

  const placeholders = ["{{clientName}}", "{{projectName}}", "{{companyName}}", "{{date}}"];

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-heading-h2 text-foreground">Przywitaj swoich klientów</h1>
        <p className="text-muted-foreground text-body-sm mt-2">
          Ten e-mail zostanie wysłany automatycznie, gdy opublikujesz projekt
        </p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-2">
          <span className="text-body-sm text-muted-foreground">Dostępne zmienne:</span>
          {placeholders.map((p) => (
            <Badge key={p} variant="outline" className="font-mono text-xs">
              {p}
            </Badge>
          ))}
        </div>

        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.emailSubject}>
            <FieldLabel htmlFor="emailSubject">Temat</FieldLabel>
            <Input id="emailSubject" placeholder="Temat wiadomości" {...form.register("emailSubject")} />
            <FieldError errors={[form.formState.errors.emailSubject]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.emailBody}>
            <FieldLabel htmlFor="emailBody">Treść wiadomości</FieldLabel>
            <Textarea id="emailBody" rows={8} placeholder="Treść e-maila..." {...form.register("emailBody")} />
            <FieldError errors={[form.formState.errors.emailBody]} />
          </Field>
        </FieldGroup>

        <StepNavigation backHref="/onboarding/template" isSubmitting={form.formState.isSubmitting} isLastStep />
      </form>
    </div>
  );
}

"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel, Input, Textarea, toast } from "@szum-tech/design-system";
import { StepNavigation } from "~/features/onboarding/components/step-navigation";
import { emailSchema, type EmailFormData } from "~/features/onboarding/schemas/email-schema";
import { type RedirectAction } from "~/lib/action-types";

type EmailFormProps = {
  defaultValues: EmailFormData;
  onContinueAction: (formData: EmailFormData) => RedirectAction;
  backHref: string;
};

export function EmailForm({ defaultValues, onContinueAction, backHref }: EmailFormProps) {
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues
  });

  async function handleSubmit(data: EmailFormData) {
    const result = await onContinueAction(data);

    if (!result.success) {
      toast.error("Błąd", { description: result.error });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-6">
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

      <StepNavigation backHref={backHref} isSubmitting={form.formState.isSubmitting} isLastStep />
    </form>
  );
}

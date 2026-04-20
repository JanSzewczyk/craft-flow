"use client";

import { ArrowLeftIcon } from "lucide-react";
import { type DefaultValues, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldGroup, toast } from "@szum-tech/design-system";
import { EmailTemplateFormFields } from "~/features/contractor/components";
import { emailSchema, type EmailFormData } from "~/features/contractor/schemas/email-schema";
import { DEFAULT_EMAIL_BODY, DEFAULT_EMAIL_SUBJECT } from "~/features/onboarding/constants";
import { type RedirectAction } from "~/lib/action-types";

type EmailFormProps = {
  defaultValues?: DefaultValues<EmailFormData> | null;
  onContinueAction(formData: EmailFormData): RedirectAction;
  onBackAction(): void;
};

export function EmailForm({ defaultValues, onContinueAction, onBackAction }: EmailFormProps) {
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: defaultValues ?? {
      emailSubject: DEFAULT_EMAIL_SUBJECT,
      emailBody: DEFAULT_EMAIL_BODY
    }
  });

  async function handleSubmit(data: EmailFormData) {
    const result = await onContinueAction(data);

    if (!result.success) {
      toast.error("Błąd", { description: result.error });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-6">
      <FieldGroup className="container-xl">
        <EmailTemplateFormFields form={form} />
      </FieldGroup>

      <div className="flex justify-between gap-4 pt-6">
        <Button variant="outline" startIcon={<ArrowLeftIcon />} onClick={() => onBackAction()}>
          Wróć
        </Button>
        <Button type="submit" loading={form.formState.isSubmitting}>
          Dalej
        </Button>
      </div>
    </form>
  );
}

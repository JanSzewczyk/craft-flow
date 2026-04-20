"use client";

import { type DefaultValues, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, toast } from "@szum-tech/design-system";
import { EmailTemplateFormFields } from "~/features/contractor/components/form/email-template-form-fields";
import { emailSchema, type EmailFormData } from "~/features/contractor/schemas/email-schema";
import { type EmailTemplate } from "~/features/contractor/server";
import { DEFAULT_EMAIL_BODY, DEFAULT_EMAIL_SUBJECT } from "~/features/onboarding/constants";
import { type ActionResponse } from "~/lib/action-types";

type EmailTemplateFormProps = {
  defaultValues?: DefaultValues<EmailFormData> | null;
  onSaveAction(data: EmailFormData): ActionResponse<EmailTemplate>;
};

export function EmailTemplateForm({ defaultValues, onSaveAction }: EmailTemplateFormProps) {
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: defaultValues ?? {
      emailSubject: DEFAULT_EMAIL_SUBJECT,
      emailBody: DEFAULT_EMAIL_BODY
    }
  });

  async function handleSubmit(data: EmailFormData) {
    const result = await onSaveAction(data);

    if (result.success) {
      toast.success(result.message ?? "Zapisano");
      form.reset(data, {
        keepDirty: false,
        keepDirtyValues: false
      });
    } else {
      toast.error("Błąd", { description: result.error });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex max-w-xl flex-col gap-6">
      <EmailTemplateFormFields form={form} />

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" disabled={!form.formState.isDirty} onClick={() => form.reset()}>
          Anuluj
        </Button>
        <Button type="submit" loading={form.formState.isSubmitting} disabled={!form.formState.isDirty}>
          Zapisz zmiany
        </Button>
      </div>
    </form>
  );
}

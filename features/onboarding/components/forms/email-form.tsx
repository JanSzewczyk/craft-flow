"use client";

import { ArrowLeftIcon } from "lucide-react";
import { type DefaultValues, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Badge,
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Textarea,
  toast
} from "@szum-tech/design-system";
import { DEFAULT_EMAIL_BODY, DEFAULT_EMAIL_PLACEHOLDERS, DEFAULT_EMAIL_SUBJECT } from "~/features/onboarding/constants";
import { emailSchema, type EmailFormData } from "~/features/onboarding/schemas/email-schema";
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
        <div>
          <span className="text-body-sm text-muted-foreground">Dostępne zmienne:</span>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_EMAIL_PLACEHOLDERS.map((p) => (
              <Badge key={p} variant="outline" className="font-code">
                {p}
              </Badge>
            ))}
          </div>
        </div>

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

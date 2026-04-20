"use client";

import { type UseFormReturn } from "react-hook-form";

import { Badge, Field, FieldError, FieldGroup, FieldLabel, Input, Textarea } from "@szum-tech/design-system";
import { type EmailFormData } from "~/features/contractor/schemas/email-schema";
import { DEFAULT_EMAIL_PLACEHOLDERS } from "~/features/onboarding/constants";

type EmailTemplateFormFieldsProps = {
  form: UseFormReturn<EmailFormData>;
  placeholders?: string[];
};

export function EmailTemplateFormFields({
  form,
  placeholders = DEFAULT_EMAIL_PLACEHOLDERS
}: EmailTemplateFormFieldsProps) {
  return (
    <FieldGroup>
      <div>
        <span className="text-body-sm text-muted-foreground">Dostępne zmienne:</span>
        <div className="flex flex-wrap gap-2">
          {placeholders.map((p) => (
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
  );
}

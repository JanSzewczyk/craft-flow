"use client";

import { LockIcon } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";

import { Field, FieldError, FieldGroup, FieldLabel, Input } from "@szum-tech/design-system";
import { type ClientFormData } from "~/features/crm/schemas/client-schema";

type ClientFormFieldsProps = {
  form: UseFormReturn<ClientFormData>;
  isEmailLocked?: boolean;
};

export function ClientFormFields({ form, isEmailLocked = false }: ClientFormFieldsProps) {
  return (
    <FieldGroup>
      <Field data-invalid={!!form.formState.errors.name}>
        <FieldLabel htmlFor="client-name">Imię i Nazwisko</FieldLabel>
        <Input id="client-name" placeholder="np. Jan Kowalski" {...form.register("name")} />
        <FieldError errors={[form.formState.errors.name]} />
      </Field>

      <Field data-invalid={!!form.formState.errors.email}>
        <FieldLabel htmlFor="client-email">
          E-mail
          {isEmailLocked ? <LockIcon className="text-muted-foreground ml-1 inline size-3" aria-hidden="true" /> : null}
        </FieldLabel>
        <Input
          id="client-email"
          type="email"
          placeholder="jan@gmail.com"
          disabled={isEmailLocked}
          {...form.register("email")}
        />
        <FieldError errors={[form.formState.errors.email]} />
      </Field>

      <Field data-invalid={!!form.formState.errors.phone}>
        <FieldLabel htmlFor="client-phone">
          Telefon <span className="text-mute">(Opcjonalne)</span>
        </FieldLabel>
        <Input
          id="client-phone"
          type="tel"
          placeholder="+48 ..."
          {...form.register("phone", { setValueAs: (val: string) => val || null })}
        />
        <FieldError errors={[form.formState.errors.phone]} />
      </Field>
    </FieldGroup>
  );
}

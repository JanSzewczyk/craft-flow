import { type UseFormReturn } from "react-hook-form";

import { Field, FieldError, FieldGroup, FieldLabel, Input, Textarea } from "@szum-tech/design-system";
import { type TemplateStepFormData } from "~/features/onboarding/schemas/template-schema";

type TemplateFormFieldsProps = {
  form: UseFormReturn<TemplateStepFormData>;
};

export function TemplateStepFormFields({ form }: TemplateFormFieldsProps) {
  return (
    <FieldGroup>
      <Field data-invalid={!!form.formState.errors.title}>
        <FieldLabel htmlFor="step-title">Nazwa etapu</FieldLabel>
        <Input id="step-title" placeholder="np. Pomiar" {...form.register("title")} />
        <FieldError errors={[form.formState.errors.title]} />
      </Field>
      <Field data-invalid={!!form.formState.errors.description}>
        <FieldLabel htmlFor="step-description">Krótki opis</FieldLabel>
        <Textarea
          id="step-description"
          placeholder="Dodaj krótki opis czynności..."
          {...form.register("description", { setValueAs: (val) => val || null })}
        />
        <FieldError errors={[form.formState.errors.description]} />
      </Field>
    </FieldGroup>
  );
}

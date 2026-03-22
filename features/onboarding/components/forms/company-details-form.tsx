"use client";

import { ArrowRightIcon, InfoIcon } from "lucide-react";
import { Controller, type DefaultValues, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  AlertTitle,
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  toast
} from "@szum-tech/design-system";
import { INDUSTRIES } from "~/features/onboarding/constants/industries";
import {
  companyDetailsSchema,
  type CompanyDetailsFormData
} from "~/features/onboarding/schemas/company-details-schema";
import { type RedirectAction } from "~/lib/action-types";

type CompanyDetailsFormProps = {
  defaultValues?: DefaultValues<CompanyDetailsFormData> | null;
  onContinueAction(formData: CompanyDetailsFormData): RedirectAction;
};

export function CompanyDetailsForm({ defaultValues, onContinueAction }: CompanyDetailsFormProps) {
  const form = useForm<CompanyDetailsFormData>({
    resolver: zodResolver(companyDetailsSchema),
    defaultValues: defaultValues ?? {}
  });

  async function handleSubmit(data: CompanyDetailsFormData) {
    const result = await onContinueAction(data);

    if (!result.success) {
      toast.error("Błąd", { description: result.error });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-6">
      <FieldGroup className="mx-auto max-w-xl">
        <Field data-invalid={!!form.formState.errors.companyName}>
          <FieldLabel htmlFor="companyName">Nazwa firmy</FieldLabel>
          <Input
            id="companyName"
            placeholder="np. Stolarnia u Jana"
            autoComplete="organization"
            aria-invalid={!!form.formState.errors.companyName}
            {...form.register("companyName")}
          />
          <FieldError errors={[form.formState.errors.companyName]} />
        </Field>

        <Controller
          control={form.control}
          name="industry"
          render={({ field: { onChange, ...fieldProps }, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="industry">Branża</FieldLabel>
              <Select
                placeholder="Wybierz branżę"
                invalid={fieldState.invalid}
                onValueChange={onChange}
                {...fieldProps}
              >
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Alert>
          <InfoIcon />
          <AlertTitle>Ustawienia możesz później zmienić w panelu</AlertTitle>
        </Alert>
      </FieldGroup>

      <div className="flex justify-end gap-4 pt-6">
        <Button type="submit" loading={form.formState.isSubmitting} startIcon={<ArrowRightIcon />}>
          Dalej
        </Button>
      </div>
    </form>
  );
}

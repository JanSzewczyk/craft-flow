"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem
} from "@szum-tech/design-system";
import { type CompanyDetailsFormData } from "~/features/contractor/schemas/company-details-schema";
import { INDUSTRIES } from "~/features/onboarding/constants/industries";

type CompanyProfileFormFieldsProps = {
  form: UseFormReturn<CompanyDetailsFormData>;
};

export function CompanyProfileFormFields({ form }: CompanyProfileFormFieldsProps) {
  return (
    <FieldGroup>
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
            <Select placeholder="Wybierz branżę" invalid={fieldState.invalid} onValueChange={onChange} {...fieldProps}>
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

      <Field data-invalid={!!form.formState.errors.phone}>
        <FieldLabel htmlFor="phone">
          Telefon <span className="text-muted-foreground">(opcjonalny)</span>
        </FieldLabel>
        <Input
          id="phone"
          type="tel"
          placeholder="np. +48 123 456 789"
          autoComplete="tel"
          aria-invalid={!!form.formState.errors.phone}
          {...form.register("phone", { setValueAs: (val) => val || null })}
        />
        <FieldError errors={[form.formState.errors.phone]} />
      </Field>
    </FieldGroup>
  );
}

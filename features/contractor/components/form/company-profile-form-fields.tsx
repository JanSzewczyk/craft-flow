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
import { z } from "zod";
import {
  companyDetailsSchema,
  type CompanyDetailsFormData
} from "~/features/contractor/schemas/company-details-schema";
import { INDUSTRIES } from "~/features/onboarding/constants/industries";

type CompanyDetailsFormInput = z.input<typeof companyDetailsSchema>;

type CompanyProfileFormFieldsProps = {
  form: UseFormReturn<CompanyDetailsFormInput, unknown, CompanyDetailsFormData>;
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
          Telefon <span className="text-mute">(opcjonalny)</span>
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

      <Field data-invalid={!!form.formState.errors.nip}>
        <FieldLabel htmlFor="nip">
          NIP <span className="text-mute">(opcjonalny)</span>
        </FieldLabel>
        <Input
          id="nip"
          placeholder="np. 1234567890"
          aria-invalid={!!form.formState.errors.nip}
          {...form.register("nip", { setValueAs: (val) => val || null })}
        />
        <FieldError errors={[form.formState.errors.nip]} />
      </Field>

      <Field data-invalid={!!form.formState.errors.regon}>
        <FieldLabel htmlFor="regon">
          REGON <span className="text-mute">(opcjonalny)</span>
        </FieldLabel>
        <Input
          id="regon"
          placeholder="np. 123456789"
          aria-invalid={!!form.formState.errors.regon}
          {...form.register("regon", { setValueAs: (val) => val || null })}
        />
        <FieldError errors={[form.formState.errors.regon]} />
      </Field>

      <Field data-invalid={!!form.formState.errors.email}>
        <FieldLabel htmlFor="email">Publiczny e-mail</FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="np. kontakt@firma.pl"
          autoComplete="email"
          aria-invalid={!!form.formState.errors.email}
          {...form.register("email")}
        />
        <FieldError errors={[form.formState.errors.email]} />
      </Field>
    </FieldGroup>
  );
}

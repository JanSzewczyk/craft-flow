"use client";

import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";

import { Field, FieldError, FieldGroup, FieldLabel, Input, Textarea } from "@szum-tech/design-system";
import {
  type companyDetailsSchema,
  type CompanyDetailsFormData
} from "~/features/contractor/schemas/company-details-schema";

type CompanyDetailsFormInput = z.input<typeof companyDetailsSchema>;

type AddressFormFieldsProps = {
  form: UseFormReturn<CompanyDetailsFormInput, unknown, CompanyDetailsFormData>;
};

export function AddressFormFields({ form }: AddressFormFieldsProps) {
  const errors = form.formState.errors.address;

  return (
    <FieldGroup>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field data-invalid={!!errors?.street}>
          <FieldLabel htmlFor="address-street">
            Ulica i numer <span className="text-muted-foreground">(opcjonalna)</span>
          </FieldLabel>
          <Input
            id="address-street"
            placeholder="np. ul. Główna 1"
            aria-invalid={!!errors?.street}
            {...form.register("address.street")}
          />
          <FieldError errors={[errors?.street]} />
        </Field>

        <Field data-invalid={!!errors?.postalCode}>
          <FieldLabel htmlFor="address-postalCode">
            Kod pocztowy <span className="text-muted-foreground">(opcjonalny)</span>
          </FieldLabel>
          <Input
            id="address-postalCode"
            placeholder="np. 00-001"
            aria-invalid={!!errors?.postalCode}
            {...form.register("address.postalCode")}
          />
          <FieldError errors={[errors?.postalCode]} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field data-invalid={!!errors?.city}>
          <FieldLabel htmlFor="address-city">
            Miasto <span className="text-muted-foreground">(opcjonalne)</span>
          </FieldLabel>
          <Input
            id="address-city"
            placeholder="np. Warszawa"
            aria-invalid={!!errors?.city}
            {...form.register("address.city")}
          />
          <FieldError errors={[errors?.city]} />
        </Field>

        <Field data-invalid={!!errors?.country}>
          <FieldLabel htmlFor="address-country">Kraj</FieldLabel>
          <Input
            id="address-country"
            placeholder="np. Polska"
            aria-invalid={!!errors?.country}
            {...form.register("address.country")}
          />
          <FieldError errors={[errors?.country]} />
        </Field>
      </div>

      <Field data-invalid={!!errors?.additionalInfo}>
        <FieldLabel htmlFor="address-additionalInfo">
          Informacje dodatkowe <span className="text-muted-foreground">(opcjonalne)</span>
        </FieldLabel>
        <Textarea
          id="address-additionalInfo"
          placeholder="np. piętro 3, biuro 12"
          aria-invalid={!!errors?.additionalInfo}
          {...form.register("address.additionalInfo", { setValueAs: (val) => val || null })}
        />
        <FieldError errors={[errors?.additionalInfo]} />
      </Field>
    </FieldGroup>
  );
}

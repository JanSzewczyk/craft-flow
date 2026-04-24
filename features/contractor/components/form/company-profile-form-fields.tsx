"use client";

import * as React from "react";

import { Controller, type UseFormReturn } from "react-hook-form";

import {
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
  Select,
  SelectContent,
  SelectItem
} from "@szum-tech/design-system";
import { type CompanyDetailsFormData } from "~/features/contractor/schemas";
import { INDUSTRIES } from "~/features/onboarding/constants/industries";

type CompanyProfileFormFieldsProps = {
  form: UseFormReturn<CompanyDetailsFormData>;
};

export function CompanyProfileFormFields({ form }: CompanyProfileFormFieldsProps) {
  const [showAddress, setShowAddress] = React.useState(() => !!form.getValues("address"));

  function handleAddressToggle(checked: boolean) {
    setShowAddress(checked);
    if (checked) {
      form.setValue("address", { street: "", postalCode: "", city: "", country: "Polska", additionalInfo: null });
    } else {
      form.setValue("address", null);
      form.clearErrors("address");
    }
  }

  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Dane Twojej firmy</FieldLegend>
        <FieldDescription>
          Podaj podstawowe informacje o swojej firmie. Nazwa i branża są wymagane; NIP i REGON są opcjonalne i służą do
          identyfikacji w dokumentach.
        </FieldDescription>
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

          <Field data-invalid={!!form.formState.errors.nip}>
            <FieldLabel htmlFor="nip">
              NIP <span className="text-muted-foreground">(opcjonalny)</span>
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
              REGON <span className="text-muted-foreground">(opcjonalny)</span>
            </FieldLabel>
            <Input
              id="regon"
              placeholder="np. 123456789"
              aria-invalid={!!form.formState.errors.regon}
              {...form.register("regon", { setValueAs: (val) => val || null })}
            />
            <FieldError errors={[form.formState.errors.regon]} />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Twoje dane kontaktowe</FieldLegend>
        <FieldDescription>
          Podaj dane kontaktowe, pod którymi Twoi klienci będą mogli się z Tobą skontaktować. Adres e-mail jest wymagany
          i będzie widoczny na fakturach.
        </FieldDescription>
        <FieldGroup>
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
      </FieldSet>

      <FieldSet>
        <FieldLegend>Adres siedziby Twojej firmy</FieldLegend>

        <FieldGroup>
          <Field orientation="horizontal">
            <Checkbox id="show-address" checked={showAddress} onCheckedChange={handleAddressToggle} />
            <FieldContent>
              <FieldLabel htmlFor="show-address">Chcę podać adres siedziby firmy</FieldLabel>
              <FieldDescription>
                Po zaznaczeniu pojawią się pola adresowe. Ulica, kod pocztowy i miasto staną się wymagane — adres
                zostanie dołączony do faktur i dokumentów.
              </FieldDescription>
            </FieldContent>
          </Field>

          {showAddress ? (
            <React.Fragment>
              <Field data-invalid={!!form.formState.errors.address?.street}>
                <FieldLabel htmlFor="address-street">Ulica i numer</FieldLabel>
                <Input
                  id="address-street"
                  placeholder="np. ul. Główna 1"
                  aria-invalid={!!form.formState.errors.address?.street}
                  {...form.register("address.street")}
                />
                <FieldError errors={[form.formState.errors.address?.street]} />
              </Field>

              <Field data-invalid={!!form.formState.errors.address?.additionalInfo}>
                <FieldLabel htmlFor="address-additionalInfo">
                  Informacje dodatkowe <span className="text-muted-foreground">(opcjonalne)</span>
                </FieldLabel>
                <Input
                  id="address-additionalInfo"
                  placeholder="np. piętro 3, biuro 12"
                  aria-invalid={!!form.formState.errors.address?.additionalInfo}
                  {...form.register("address.additionalInfo", { setValueAs: (val) => val || null })}
                />
                <FieldError errors={[form.formState.errors.address?.additionalInfo]} />
              </Field>

              <div className="grid grid-cols-1 gap-7 sm:grid-cols-3">
                <Field data-invalid={!!form.formState.errors.address?.city}>
                  <FieldLabel htmlFor="address-city">Miasto</FieldLabel>
                  <Input
                    id="address-city"
                    placeholder="np. Warszawa"
                    aria-invalid={!!form.formState.errors.address?.city}
                    {...form.register("address.city")}
                  />
                  <FieldError errors={[form.formState.errors.address?.city]} />
                </Field>
                <Field data-invalid={!!form.formState.errors.address?.postalCode}>
                  <FieldLabel htmlFor="address-postalCode">Kod pocztowy</FieldLabel>
                  <Input
                    id="address-postalCode"
                    placeholder="np. 00-001"
                    aria-invalid={!!form.formState.errors.address?.postalCode}
                    {...form.register("address.postalCode")}
                  />
                  <FieldError errors={[form.formState.errors.address?.postalCode]} />
                </Field>
                <Field data-invalid={!!form.formState.errors.address?.country}>
                  <FieldLabel htmlFor="address-country">Kraj</FieldLabel>
                  <Input
                    id="address-country"
                    placeholder="np. Polska"
                    aria-invalid={!!form.formState.errors.address?.country}
                    {...form.register("address.country")}
                  />
                  <FieldError errors={[form.formState.errors.address?.country]} />
                </Field>
              </div>
            </React.Fragment>
          ) : null}
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}

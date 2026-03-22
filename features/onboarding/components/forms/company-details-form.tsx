"use client";

import * as React from "react";

import { InfoIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
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
import { useRouter } from "next/navigation";
import { StepNavigation } from "~/features/onboarding/components/step-navigation";
import { INDUSTRIES } from "~/features/onboarding/constants/industries";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import {
  companyDetailsSchema,
  type CompanyDetailsFormData
} from "~/features/onboarding/schemas/company-details-schema";
import { saveStep } from "~/features/onboarding/server/actions/save-step";

type CompanyDetailsFormProps = {
  defaultValues: CompanyDetailsFormData;
  nextStep: string;
};

export function CompanyDetailsForm({ defaultValues, nextStep }: CompanyDetailsFormProps) {
  const router = useRouter();
  const form = useForm<CompanyDetailsFormData>({
    resolver: zodResolver(companyDetailsSchema),
    defaultValues
  });

  async function handleSubmit(data: CompanyDetailsFormData) {
    const result = await saveStep(OnboardingStep.COMPANY_DETAILS, nextStep, data);

    if (result.success) {
      router.push(`/onboarding/${nextStep}`);
    } else {
      toast.error("Błąd", { description: result.error });
    }
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-heading-h2 text-foreground">Opowiedz nam o swoim warsztacie</h1>
        <p className="text-muted-foreground text-body-sm mt-2">
          Te dane pojawią się na Twoich fakturach i w portalu klienta
        </p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-6">
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
        </FieldGroup>

        <div className="text-muted-foreground flex items-center gap-2 rounded-lg border p-3">
          <InfoIcon className="size-4 shrink-0" />
          <span className="text-body-sm">Ustawienia możesz później zmienić w panelu</span>
        </div>

        <StepNavigation isSubmitting={form.formState.isSubmitting} />
      </form>
    </div>
  );
}

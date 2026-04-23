"use client";

import { ArrowRightIcon, InfoIcon } from "lucide-react";
import { type DefaultValues, useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertTitle, Button, toast } from "@szum-tech/design-system";
import { CompanyProfileFormFields } from "~/features/contractor/components";
import {
  companyDetailsSchema,
  type CompanyDetailsFormData
} from "~/features/contractor/schemas/company-details-schema";
import { type RedirectAction } from "~/lib/action-types";

type CompanyDetailsFormInput = z.input<typeof companyDetailsSchema>;

type CompanyDetailsFormProps = {
  defaultValues?: DefaultValues<CompanyDetailsFormInput> | null;
  onContinueAction(formData: CompanyDetailsFormData): RedirectAction;
};

export function CompanyDetailsForm({ defaultValues, onContinueAction }: CompanyDetailsFormProps) {
  const form = useForm<CompanyDetailsFormInput, unknown, CompanyDetailsFormData>({
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
      <div className="container-xl space-y-4">
        <CompanyProfileFormFields form={form} />

        <Alert>
          <InfoIcon />
          <AlertTitle>Ustawienia możesz później zmienić w panelu</AlertTitle>
        </Alert>
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <Button type="submit" loading={form.formState.isSubmitting} startIcon={<ArrowRightIcon />}>
          Dalej
        </Button>
      </div>
    </form>
  );
}

"use client";

import { type DefaultValues, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, toast } from "@szum-tech/design-system";
import { CompanyProfileFormFields } from "~/features/contractor/components/form/company-profile-form-fields";
import {
  companyDetailsSchema,
  type CompanyDetailsFormData
} from "~/features/contractor/schemas/company-details-schema";
import { type ActionResponse } from "~/lib/action-types";

type CompanyProfileFormProps = {
  defaultValues: DefaultValues<CompanyDetailsFormData>;
  onSaveAction(data: CompanyDetailsFormData): ActionResponse;
};

export function CompanyProfileForm({ defaultValues, onSaveAction }: CompanyProfileFormProps) {
  const form = useForm<CompanyDetailsFormData>({
    resolver: zodResolver(companyDetailsSchema),
    defaultValues
  });

  async function handleSubmit(data: CompanyDetailsFormData) {
    const result = await onSaveAction(data);

    if (result.success) {
      toast.success(result.message ?? "Zapisano");
      form.reset(data);
    } else {
      toast.error("Błąd", { description: result.error });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex max-w-xl flex-col gap-6">
      <CompanyProfileFormFields form={form} />

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" disabled={!form.formState.isDirty} onClick={() => form.reset()}>
          Anuluj
        </Button>
        <Button type="submit" loading={form.formState.isSubmitting} disabled={!form.formState.isDirty}>
          Zapisz zmiany
        </Button>
      </div>
    </form>
  );
}

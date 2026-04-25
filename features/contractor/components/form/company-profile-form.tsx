"use client";

import * as React from "react";

import { type DefaultValues, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, toast } from "@szum-tech/design-system";
import { useRouter } from "next/navigation";
import {
  companyDetailsSchema,
  type CompanyDetailsFormData
} from "~/features/contractor/schemas/company-details-schema";
import { type RedirectAction } from "~/lib/action-types";

import { CompanyProfileFormFields } from "./company-profile-form-fields";

type CompanyProfileFormProps = {
  defaultValues?: DefaultValues<CompanyDetailsFormData> | null;
  onSaveAction(data: CompanyDetailsFormData): RedirectAction;
};

export function CompanyProfileForm({ defaultValues, onSaveAction }: CompanyProfileFormProps) {
  const router = useRouter();
  const form = useForm<CompanyDetailsFormData>({
    resolver: zodResolver(companyDetailsSchema),
    defaultValues: defaultValues ?? {}
  });

  async function handleSubmit(data: CompanyDetailsFormData) {
    const result = await onSaveAction(data);

    if (!result.success) {
      toast.error("Błąd", { description: result.error });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-6">
      <CompanyProfileFormFields form={form} />

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={() => router.push("/app/company")}>
          Anuluj
        </Button>
        <Button type="submit" loading={form.formState.isSubmitting} disabled={!form.formState.isDirty}>
          Zapisz zmiany
        </Button>
      </div>
    </form>
  );
}

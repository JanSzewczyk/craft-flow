"use client";

import { type DefaultValues, useForm } from "react-hook-form";
import { type z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, toast } from "@szum-tech/design-system";
import { useRouter } from "next/navigation";
import { CompanyProfileFormFields } from "~/features/contractor/components/form/company-profile-form-fields";
import {
  companyDetailsSchema,
  type CompanyDetailsFormData
} from "~/features/contractor/schemas/company-details-schema";
import { type ActionResponse } from "~/lib/action-types";

type CompanyDetailsFormInput = z.input<typeof companyDetailsSchema>;

type CompanyProfileFormProps = {
  defaultValues: DefaultValues<CompanyDetailsFormInput>;
  onSaveAction(data: CompanyDetailsFormData): ActionResponse;
};

export function CompanyProfileForm({ defaultValues, onSaveAction }: CompanyProfileFormProps) {
  const router = useRouter();
  const form = useForm<CompanyDetailsFormInput, unknown, CompanyDetailsFormData>({
    resolver: zodResolver(companyDetailsSchema),
    defaultValues
  });

  async function handleSubmit(data: CompanyDetailsFormData) {
    const result = await onSaveAction(data);

    if (result.success) {
      toast.success(result.message ?? "Zapisano");
      router.push("/app/company");
    } else {
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

"use client";

import * as React from "react";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { type DefaultValues, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, toast } from "@szum-tech/design-system";
import { TemplateFormFields } from "~/features/templates/components/forms/template-form-fields";
import { DEFAULT_TEMPLATE_NAME, DEFAULT_TEMPLATE_STEPS } from "~/features/onboarding/constants/defaults";
import { templateSchema, type TemplateFormData } from "~/features/templates/schemas/template-schema";
import { type RedirectAction } from "~/lib/action-types";

type TemplateFormProps = {
  defaultValues?: DefaultValues<TemplateFormData> | null;
  onContinueAction(formData: TemplateFormData): RedirectAction;
  onBackAction(): void;
};

export function TemplateForm({ defaultValues, onContinueAction, onBackAction }: TemplateFormProps) {
  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: defaultValues ?? {
      name: DEFAULT_TEMPLATE_NAME,
      description: null,
      steps: DEFAULT_TEMPLATE_STEPS
    }
  });

  async function handleSubmit(data: TemplateFormData) {
    const result = await onContinueAction(data);

    if (!result.success) {
      toast.error("Błąd", { description: result.error });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
      <div className="container-xl">
        <TemplateFormFields form={form} />
      </div>

      <div className="flex justify-between gap-4 pt-12">
        <Button variant="outline" type="button" startIcon={<ArrowLeftIcon />} onClick={onBackAction}>
          Wróć
        </Button>
        <Button type="submit" loading={form.formState.isSubmitting} endIcon={<ArrowRightIcon />}>
          Dalej
        </Button>
      </div>
    </form>
  );
}

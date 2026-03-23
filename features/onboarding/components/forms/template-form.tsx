"use client";

import { ArrowLeftIcon, ArrowRightIcon, GripVerticalIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import { Button, Input, toast } from "@szum-tech/design-system";
import { type TemplateFormData, templateSchema } from "~/features/onboarding/schemas/template-schema";
import { type RedirectAction } from "~/lib/action-types";

type TemplateFormProps = {
  defaultValues: { templateSteps: string[] };
  onContinueAction: (formData: TemplateFormData) => RedirectAction;
  onBackAction: () => void;
};

type FormValues = {
  steps: { value: string }[];
};

export function TemplateForm({ defaultValues, onContinueAction, onBackAction }: TemplateFormProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      steps: defaultValues.templateSteps.map((s) => ({ value: s }))
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "steps"
  });

  async function handleSubmit(data: FormValues) {
    const templateSteps = data.steps.map((s) => s.value).filter((v) => v.trim() !== "");

    const parsed = templateSchema.safeParse({ templateSteps });
    if (!parsed.success) {
      toast.error("Błąd", { description: "Dodaj co najmniej jeden etap" });
      return;
    }

    const result = await onContinueAction({ templateSteps });

    if (!result.success) {
      toast.error("Błąd", { description: result.error });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <GripVerticalIcon className="text-muted-foreground size-5 shrink-0 cursor-grab" />
            <span className="text-muted-foreground text-body-sm w-6 shrink-0 text-center">{index + 1}.</span>
            <Input placeholder="Nazwa etapu" {...form.register(`steps.${index}.value`)} />
            {fields.length > 1 && (
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                <TrashIcon className="size-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" onClick={() => append({ value: "" })} className="self-start">
        <PlusIcon className="size-4" />
        Dodaj kolejny etap
      </Button>

      <div className="flex justify-between gap-4 pt-6">
        <Button variant="outline" type="button" startIcon={<ArrowLeftIcon />} onClick={() => onBackAction()}>
          Wróć
        </Button>
        <Button type="submit" loading={form.formState.isSubmitting} endIcon={<ArrowRightIcon />}>
          Dalej
        </Button>
      </div>
    </form>
  );
}

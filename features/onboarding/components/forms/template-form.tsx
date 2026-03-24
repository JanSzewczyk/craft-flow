"use client";

import * as React from "react";

import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from "lucide-react";
import { type DefaultValues, type FieldArrayWithId, useFieldArray, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Sortable, SortableItem, toast } from "@szum-tech/design-system";
import { TemplateStepFormDialog } from "~/features/onboarding/components/forms/template-step-form-dialog";
import { TemplateStepItemForm } from "~/features/onboarding/components/forms/template-step-item";
import { DEFAULT_TEMPLATE_STEPS } from "~/features/onboarding/constants/defaults";
import {
  type TemplateFormData,
  templateSchema,
  type TemplateStepFormData
} from "~/features/onboarding/schemas/template-schema";
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
      templateSteps: DEFAULT_TEMPLATE_STEPS
    }
  });

  const templateStepsFields = useFieldArray({
    control: form.control,
    name: "templateSteps"
  });

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  function handleOpenAddDialog() {
    setIsAddModalOpen(true);
  }

  function handleAddTemplateStep(step: TemplateStepFormData) {
    templateStepsFields.append(step);
  }
  function handleRemoveTemplateStep(index: number) {
    templateStepsFields.remove(index);
  }
  function handleUpdateTemplateStep(index: number, updatedStep: TemplateStepFormData) {
    templateStepsFields.update(index, updatedStep);
  }

  function handleSortChange(sorted: Array<FieldArrayWithId<TemplateFormData, "templateSteps">>) {
    templateStepsFields.replace(sorted.map(({ title, description }) => ({ title, description })));
  }

  async function handleSubmit(data: TemplateFormData) {
    const result = await onContinueAction(data);

    if (!result.success) {
      toast.error("Błąd", { description: result.error });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
      <div className="container-xl space-y-4">
        <Sortable
          value={templateStepsFields.fields}
          onValueChange={handleSortChange}
          getItemValue={(s) => s.id}
          strategy="vertical"
          className="space-y-2"
        >
          {templateStepsFields.fields.map((field, index) => (
            <SortableItem key={field.id} value={field.id} asChild>
              <div>
                <TemplateStepItemForm
                  templateStep={field}
                  canRemove={templateStepsFields.fields.length > 1}
                  onUpdate={(updatedStep) => handleUpdateTemplateStep(index, updatedStep)}
                  onRemove={() => handleRemoveTemplateStep(index)}
                />
              </div>
            </SortableItem>
          ))}
        </Sortable>

        <Button
          type="button"
          fullWidth
          size="lg"
          variant="outline"
          startIcon={<PlusIcon />}
          onClick={handleOpenAddDialog}
        >
          Dodaj etap
        </Button>
      </div>

      {isAddModalOpen ? (
        <TemplateStepFormDialog onOpenChange={setIsAddModalOpen} onSubmit={handleAddTemplateStep} />
      ) : null}

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

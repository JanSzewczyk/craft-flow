"use client";

import * as React from "react";

import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from "lucide-react";
import { type DefaultValues, type FieldArrayWithId, useFieldArray, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Sortable,
  SortableItem,
  Textarea,
  toast
} from "@szum-tech/design-system";
import { TemplateStepFormDialog } from "~/features/onboarding/components/forms/template-step-form-dialog";
import { TemplateStepItemForm } from "~/features/onboarding/components/forms/template-step-item";
import { DEFAULT_TEMPLATE_NAME, DEFAULT_TEMPLATE_STEPS } from "~/features/onboarding/constants/defaults";
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
      name: DEFAULT_TEMPLATE_NAME,
      description: null,
      steps: DEFAULT_TEMPLATE_STEPS
    }
  });

  const stepsFields = useFieldArray({
    control: form.control,
    name: "steps"
  });

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  function handleOpenAddDialog() {
    setIsAddModalOpen(true);
  }

  function handleAddTemplateStep(step: TemplateStepFormData) {
    stepsFields.append(step);
  }
  function handleRemoveTemplateStep(index: number) {
    stepsFields.remove(index);
  }
  function handleUpdateTemplateStep(index: number, updatedStep: TemplateStepFormData) {
    stepsFields.update(index, updatedStep);
  }

  function handleSortChange(sorted: Array<FieldArrayWithId<TemplateFormData, "steps">>) {
    stepsFields.replace(sorted.map(({ title, description }) => ({ title, description })));
  }

  async function handleSubmit(data: TemplateFormData) {
    const result = await onContinueAction(data);

    if (!result.success) {
      toast.error("Błąd", { description: result.error });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
      <FieldGroup className="container-xl">
        <Field data-invalid={!!form.formState.errors.name}>
          <FieldLabel htmlFor="name">Nazwa szablonu</FieldLabel>
          <Input id="name" placeholder="Np. Remont łazienki" {...form.register("name")} />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.description}>
          <FieldLabel htmlFor="description">
            Opis <span className="text-muted-foreground">(opcjonalny)</span>
          </FieldLabel>
          <Textarea
            id="description"
            rows={3}
            placeholder="Krótki opis szablonu..."
            {...form.register("description", { setValueAs: (val) => val || null })}
          />
        </Field>

        <Field data-invalid={!!form.formState.errors.steps}>
          <FieldLabel>Kroki</FieldLabel>
          <FieldDescription>
            Zdefiniuj kolejne kroki, które będą wyświetlane podczas realizacji zadań utworzonych na podstawie tego
            szablonu. Możesz je później edytować lub usuwać, a także zmieniać ich kolejność przeciągając.
          </FieldDescription>
          <Sortable
            value={stepsFields.fields}
            onValueChange={handleSortChange}
            getItemValue={(s) => s.id}
            strategy="vertical"
            className="space-y-2"
          >
            {stepsFields.fields.map((field, index) => (
              <SortableItem key={field.id} value={field.id} asChild>
                <div>
                  <TemplateStepItemForm
                    templateStep={field}
                    canRemove={stepsFields.fields.length > 1}
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
        </Field>
      </FieldGroup>

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

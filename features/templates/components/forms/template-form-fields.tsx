"use client";

import * as React from "react";

import { InfoIcon, PlusIcon } from "lucide-react";
import { type FieldArrayWithId, useFieldArray, type UseFormReturn } from "react-hook-form";

import {
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Sortable,
  SortableItem,
  Textarea
} from "@szum-tech/design-system";

import { TemplateStepFormDialog } from "~/features/templates/components/forms/template-step-form-dialog";
import { TemplateStepItemForm } from "~/features/templates/components/forms/template-step-item";
import { type TemplateFormData, type TemplateStepFormData } from "~/features/templates/schemas/template-schema";

type TemplateFormFieldsProps = {
  form: UseFormReturn<TemplateFormData>;
  /** Show the "PRO TIP" hint box — use in create flow */
  showProTip?: boolean;
};

export function TemplateFormFields({ form, showProTip = false }: TemplateFormFieldsProps) {
  const stepsFields = useFieldArray({ control: form.control, name: "steps" });
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  const stepsCount = stepsFields.fields.length;

  function handleSortChange(sorted: Array<FieldArrayWithId<TemplateFormData, "steps">>) {
    stepsFields.replace(sorted.map(({ title, description }) => ({ title, description })));
  }

  function handleAddStep(step: TemplateStepFormData) {
    stepsFields.append({ title: step.title, description: step.description });
  }

  function handleUpdateStep(index: number, updated: TemplateStepFormData) {
    stepsFields.update(index, { title: updated.title, description: updated.description });
  }

  function handleRemoveStep(index: number) {
    stepsFields.remove(index);
  }

  return (
    <FieldGroup>
      {/* Name */}
      <Field data-invalid={!!form.formState.errors.name}>
        <FieldLabel htmlFor="template-name">Nazwa szablonu</FieldLabel>
        <Input id="template-name" placeholder="np. Produkcja Stołu Loft" {...form.register("name")} />
        <FieldError errors={[form.formState.errors.name]} />
      </Field>

      {/* Description */}
      <Field data-invalid={!!form.formState.errors.description}>
        <FieldLabel htmlFor="template-description">
          Opis <span className="text-mute">(opcjonalny)</span>
        </FieldLabel>
        <Textarea
          id="template-description"
          rows={3}
          placeholder="Krótki opis szablonu..."
          {...form.register("description", { setValueAs: (val) => val || null })}
        />
        <FieldError errors={[form.formState.errors.description]} />
      </Field>

      {/* Steps */}
      <Field data-invalid={!!form.formState.errors.steps}>
        <div className="flex items-center justify-between">
          <FieldLabel>Etapy procesu</FieldLabel>
          <span className="text-muted-foreground text-xs">
            {stepsCount} {stepsCount === 1 ? "etap" : stepsCount < 5 ? "etapy" : "etapów"}
          </span>
        </div>
        <FieldError errors={[form.formState.errors.steps as { message?: string } | undefined]} />

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
                  templateStep={{ title: field.title, description: field.description ?? null }}
                  canRemove={stepsCount > 1}
                  onUpdate={(updated) => handleUpdateStep(index, updated)}
                  onRemove={() => handleRemoveStep(index)}
                />
              </div>
            </SortableItem>
          ))}
        </Sortable>

        <Button
          fullWidth
          variant="outline"
          className="border-dashed"
          startIcon={<PlusIcon />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          Dodaj kolejny etap
        </Button>
      </Field>

      {/* Pro Tip */}
      {showProTip ? (
        <div className="bg-primary/5 border-primary/20 flex gap-3 rounded-lg border p-4">
          <InfoIcon className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wider uppercase">Pro Tip</p>
            <p className="text-body-sm text-muted-foreground">
              Etapy możesz dowolnie przesuwać, aby zmieniać kolejność realizacji zadania. Każdy szablon dostępny do
              odtworzenia na wielu projektach.
            </p>
          </div>
        </div>
      ) : null}

      {/* Add step dialog */}
      {isAddDialogOpen ? <TemplateStepFormDialog onOpenChange={setIsAddDialogOpen} onSubmit={handleAddStep} /> : null}
    </FieldGroup>
  );
}

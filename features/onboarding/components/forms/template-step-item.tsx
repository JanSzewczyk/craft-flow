"use client";

import * as React from "react";

import { GripVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";

import { Button, SortableItemHandle } from "@szum-tech/design-system";
import { TemplateStepFormDialog } from "~/features/onboarding/components";
import { type TemplateStepFormData } from "~/features/onboarding/schemas/template-schema";

type TemplateStepItemFormProps = {
  templateStep: TemplateStepFormData;
  canRemove: boolean;
  onUpdate(updatedStep: TemplateStepFormData): void;
  onRemove(): void;
};

export function TemplateStepItemForm({ templateStep, canRemove, onUpdate, onRemove }: TemplateStepItemFormProps) {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  function handleOpenEditDialog() {
    setIsEditModalOpen(true);
  }

  function handleUpdateTemplateStep(updatedStep: TemplateStepFormData) {
    onUpdate(updatedStep);
  }

  return (
    <div className="bg-background flex items-center gap-3 rounded border p-4 transition-colors">
      <SortableItemHandle className="text-muted-foreground hover:text-foreground">
        <GripVerticalIcon className="size-6" />
      </SortableItemHandle>
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-medium">{templateStep.title}</h4>
        {templateStep.description ? (
          <p className="text-muted-foreground truncate text-xs">{templateStep.description}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="icon" onClick={handleOpenEditDialog}>
          <PencilIcon className="size-4" />
        </Button>
        {canRemove && (
          <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
            <TrashIcon className="size-4" />
          </Button>
        )}
      </div>

      {isEditModalOpen ? (
        <TemplateStepFormDialog
          onOpenChange={setIsEditModalOpen}
          onSubmit={handleUpdateTemplateStep}
          defaultValues={templateStep}
          mode="edit"
        />
      ) : null}
    </div>
  );
}

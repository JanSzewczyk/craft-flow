"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@szum-tech/design-system";
import { TemplateStepFormFields } from "~/features/templates/components/forms/template-step-form-fields";
import { templateStepSchema, type TemplateStepFormData } from "~/features/templates/schemas/template-schema";

type TemplateStepFormDialogProps = {
  onOpenChange(open: boolean): void;
  onSubmit(step: TemplateStepFormData): void;
  mode?: "create" | "edit";
  defaultValues?: TemplateStepFormData | null;
};

export function TemplateStepFormDialog({
  onOpenChange,
  onSubmit,
  mode = "create",
  defaultValues
}: TemplateStepFormDialogProps) {
  const form = useForm<TemplateStepFormData>({
    resolver: zodResolver(templateStepSchema),
    defaultValues: defaultValues ?? {}
  });

  function handleSubmit(data: TemplateStepFormData) {
    onSubmit(data);
    onOpenChange(false);
  }

  return (
    <Dialog defaultOpen onOpenChange={onOpenChange}>
      <DialogContent width="md" showCloseButton>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Dodaj nowy etap" : "Edytuj etap"}</DialogTitle>
          <DialogDescription>Wprowadź szczegóły kolejnego kroku w procesie</DialogDescription>
        </DialogHeader>

        <TemplateStepFormFields form={form} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Anuluj</Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(handleSubmit)}>{mode === "create" ? "Dodaj" : "Zapisz"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import * as React from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  toast
} from "@szum-tech/design-system";
import { TemplateFormFields } from "~/features/templates/components/forms/template-form-fields";
import { templateSchema, type TemplateFormData } from "~/features/templates/schemas/template-schema";
import { createTemplateAction } from "~/features/templates/server/actions/create-template.action";

type CreateTemplateSheetProps = {
  open: boolean;
  onOpenChange(open: boolean): void;
};

export function CreateTemplateSheet({ open, onOpenChange }: CreateTemplateSheetProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      description: null,
      steps: [{ title: "", description: null }]
    }
  });

  async function handleSubmit(data: TemplateFormData) {
    setIsSubmitting(true);
    try {
      const result = await createTemplateAction(data);
      if (result.success) {
        toast.success("Sukces", { description: result.message ?? "Szablon został utworzony" });
        onOpenChange(false);
      } else {
        toast.error("Błąd", { description: result.error });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="overflow-y-auto sm:max-w-150">
        <SheetHeader>
          <SheetTitle>Utwórz nowy szablon</SheetTitle>
          <SheetDescription>Zdefiniuj powtarzalne etapy, aby szybciej zarządzać nowymi zleceniami.</SheetDescription>
        </SheetHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-1 flex-col">
          <div className="flex-1 px-4">
            <TemplateFormFields form={form} showProTip />
          </div>

          <SheetFooter className="flex-row justify-end">
            <SheetClose asChild>
              <Button variant="secondary">Anuluj</Button>
            </SheetClose>

            <Button type="submit" loading={isSubmitting}>
              Stwórz szablon
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

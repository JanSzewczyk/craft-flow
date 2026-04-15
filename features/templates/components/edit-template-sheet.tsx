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
import { useRouter } from "next/navigation";
import { TemplateFormFields } from "~/features/templates/components/forms/template-form-fields";
import { templateSchema, type TemplateFormData } from "~/features/templates/schemas/template-schema";
import { type ActionResponse } from "~/lib/action-types";

import { type Template } from "../server/db/schema";

type EditTemplateSheetProps = {
  templateId: string;
  defaultValues: TemplateFormData;
  onUpdateAction(id: string, data: TemplateFormData): ActionResponse<Template>;
};

export function EditTemplateSheet({ templateId, defaultValues, onUpdateAction }: EditTemplateSheetProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues
  });

  async function handleSubmit(data: TemplateFormData) {
    setIsSubmitting(true);
    try {
      const result = await onUpdateAction(templateId, data);
      if (result.success) {
        toast.success("Sukces", { description: result.message ?? "Szablon został zapisany" });
        router.back();
      } else {
        toast.error("Błąd", { description: result.error });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setTimeout(() => {
        router.back();
      }, 200);
    }
  }

  return (
    <Sheet defaultOpen onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="overflow-y-auto sm:max-w-150">
        <SheetHeader>
          <SheetTitle>Edytuj szablon</SheetTitle>
          <SheetDescription>{defaultValues.name}</SheetDescription>
        </SheetHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-1 flex-col">
          <div className="flex-1 px-4">
            <TemplateFormFields form={form} />
          </div>

          <SheetFooter className="flex-row justify-end">
            <SheetClose asChild>
              <Button variant="secondary">Anuluj</Button>
            </SheetClose>

            <Button type="submit" loading={isSubmitting}>
              Zapisz zmiany
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

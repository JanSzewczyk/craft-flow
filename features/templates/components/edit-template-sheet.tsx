"use client";

import * as React from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Spinner,
  toast
} from "@szum-tech/design-system";
import { TemplateFormFields } from "~/features/templates/components/forms/template-form-fields";
import { templateSchema, type TemplateFormData } from "~/features/templates/schemas/template-schema";
import { getTemplateStepsAction } from "~/features/templates/server/actions/get-template-steps.action";
import { updateTemplateAction } from "~/features/templates/server/actions/update-template.action";
import { type TemplateListItem } from "~/features/templates/server/db/queries";

type EditTemplateSheetProps = {
  item: TemplateListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditTemplateSheet({ item, open, onOpenChange }: EditTemplateSheetProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [defaultValues, setDefaultValues] = React.useState<TemplateFormData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema)
  });

  React.useEffect(() => {
    if (!open || !item) {
      setDefaultValues(null);
      return;
    }

    setIsLoading(true);
    getTemplateStepsAction(item.id)
      .then((result) => {
        if (result.success) {
          const values = {
            name: item.name,
            description: item.description ?? null,
            steps: result.data.steps
          };
          setDefaultValues(values);
          form.reset(values);
        } else {
          toast.error("Błąd", { description: "Nie udało się załadować kroków szablonu" });
          onOpenChange(false);
        }
      })
      .finally(() => setIsLoading(false));
  }, [open, item]);

  async function handleSubmit(data: TemplateFormData) {
    if (!item) return;
    setIsSubmitting(true);
    try {
      const result = await updateTemplateAction(item.id, data);
      if (result.success) {
        toast.success("Sukces", { description: result.message ?? "Szablon został zapisany" });
        onOpenChange(false);
      } else {
        toast.error("Błąd", { description: result.error });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto sm:max-w-150">
        <SheetHeader>
          <SheetTitle>Edytuj szablon</SheetTitle>
          {item ? <SheetDescription>{item.name}</SheetDescription> : null}
        </SheetHeader>
        <div className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner />
            </div>
          ) : defaultValues ? (
            <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
              <TemplateFormFields form={form} />

              <SheetFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Anuluj
                </Button>
                <Button type="submit" loading={isSubmitting}>
                  Zapisz zmiany
                </Button>
              </SheetFooter>
            </form>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

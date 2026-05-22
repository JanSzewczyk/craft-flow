"use client";

import * as React from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, toast } from "@szum-tech/design-system";
import { ClientFormFields } from "~/features/crm/components/forms/client-form-fields";
import { clientSchema, type ClientFormData } from "~/features/crm/schemas/client-schema";
import { type ActionResponse } from "~/lib/action-types";

import { type Client } from "~/features/crm/types/client";

type EditClientFormProps = {
  clientId: string;
  defaultValues: ClientFormData;
  isEmailLocked: boolean;
  onUpdateAction(id: string, data: ClientFormData): ActionResponse<Client>;
};

export function EditClientForm({ clientId, defaultValues, isEmailLocked, onUpdateAction }: EditClientFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues
  });

  async function handleSubmit(data: ClientFormData) {
    setIsSubmitting(true);
    try {
      const result = await onUpdateAction(clientId, data);
      if (result.success) {
        toast.success("Sukces", { description: result.message ?? "Dane klienta zostały zaktualizowane" });
      } else {
        toast.error("Błąd", { description: result.error });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="space-y-6">
      <ClientFormFields form={form} isEmailLocked={isEmailLocked} />
      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>
          Zapisz zmiany
        </Button>
      </div>
    </form>
  );
}

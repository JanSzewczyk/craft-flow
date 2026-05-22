"use client";

import * as React from "react";

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
  DialogTitle,
  toast
} from "@szum-tech/design-system";
import { useRouter } from "next/navigation";
import { ClientFormFields } from "~/features/crm/components/forms/client-form-fields";
import { clientSchema, type ClientFormData } from "~/features/crm/schemas/client-schema";
import { type ActionResponse } from "~/lib/action-types";

import { type Client } from "~/features/crm/types/client";

type CreateClientDialogProps = {
  onCreateAction(data: ClientFormData): ActionResponse<Client>;
};

export function CreateClientDialog({ onCreateAction }: CreateClientDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: { name: "", email: "", phone: null }
  });

  async function handleSubmit(data: ClientFormData) {
    setIsSubmitting(true);
    try {
      const result = await onCreateAction(data);
      if (result.success) {
        toast.success("Sukces", { description: result.message ?? "Klient został dodany" });
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
    <Dialog defaultOpen onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nowy klient</DialogTitle>
          <DialogDescription>
            Dane klienta pozwolą na przesyłanie mu bezpiecznych linków do podglądu postępów prac.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <div className="px-4 py-2">
            <ClientFormFields form={form} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Anuluj</Button>
            </DialogClose>
            <Button type="submit" loading={isSubmitting}>
              Dodaj klienta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

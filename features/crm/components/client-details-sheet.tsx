"use client";

import * as React from "react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@szum-tech/design-system";
import { useRouter } from "next/navigation";
import { ClientDetailsContent } from "~/features/crm/components/client-details-content";
import { type ClientFormData } from "~/features/crm/schemas/client-schema";
import { type ActionResponse } from "~/lib/action-types";

import { type Client } from "~/features/crm/types/client";

type ClientDetailsSheetProps = {
  client: Client;
  onUpdateAction(id: string, data: ClientFormData): ActionResponse<Client>;
};

export function ClientDetailsSheet({ client, onUpdateAction }: ClientDetailsSheetProps) {
  const router = useRouter();

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
          <SheetTitle>{client.name}</SheetTitle>
          <SheetDescription>ID Klienta: {client.id.slice(0, 8)}</SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <ClientDetailsContent client={client} onUpdateAction={onUpdateAction} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

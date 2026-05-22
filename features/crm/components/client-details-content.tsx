"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@szum-tech/design-system";
import { EditClientForm } from "~/features/crm/components/forms/edit-client-form";
import { type ClientFormData } from "~/features/crm/schemas/client-schema";
import { type ActionResponse } from "~/lib/action-types";

import { type Client } from "~/features/crm/types/client";

type ClientDetailsContentProps = {
  client: Client;
  onUpdateAction(id: string, data: ClientFormData): ActionResponse<Client>;
};

export function ClientDetailsContent({ client, onUpdateAction }: ClientDetailsContentProps) {
  return (
    <Tabs defaultValue="details" className="space-y-4">
      <TabsList variant="line">
        <TabsTrigger value="details">Dane klienta</TabsTrigger>
        <TabsTrigger value="projects">Historia projektów</TabsTrigger>
        <TabsTrigger value="addresses">Adresy</TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <EditClientForm
          clientId={client.id}
          defaultValues={{
            name: client.name,
            email: client.email,
            phone: client.phone ?? null
          }}
          isEmailLocked={!!client.clerkUserId}
          onUpdateAction={onUpdateAction}
        />
      </TabsContent>

      <TabsContent value="projects">
        <p className="text-muted-foreground py-8 text-center">Wkrótce...</p>
      </TabsContent>

      <TabsContent value="addresses">
        <p className="text-muted-foreground py-8 text-center">Wkrótce...</p>
      </TabsContent>
    </Tabs>
  );
}

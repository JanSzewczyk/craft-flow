"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { type ClientFormData } from "~/features/crm/schemas/client-schema";
import { updateClient } from "~/features/crm/server/services/clients.service";
import { type ActionResponse } from "~/lib/action-types";

import { type Client } from "~/features/crm/types/client";

import { logger } from "./logger";
import { mapClientServiceError } from "./map-service-error";

export async function updateClientAction(id: string, data: ClientFormData): ActionResponse<Client> {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.warn({ operation: "updateClientAction" }, "Unauthenticated access attempt");
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const [error, client] = await updateClient({ contractorId: userId, clientId: id, data });
  if (error) return mapClientServiceError(error);

  revalidatePath("/app/clients");
  return { success: true, data: client, message: "Dane klienta zostały zaktualizowane" };
}

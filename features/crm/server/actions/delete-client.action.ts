"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { deleteClient } from "~/features/crm/server/services/clients.service";
import { type ActionResponse } from "~/lib/action-types";

import { logger } from "./logger";
import { mapClientServiceError } from "./map-service-error";

export async function deleteClientAction(id: string): ActionResponse<{ id: string }> {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.warn({ operation: "deleteClientAction" }, "Unauthenticated access attempt");
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const [error, result] = await deleteClient({ contractorId: userId, clientId: id });
  if (error) return mapClientServiceError(error);

  revalidatePath("/app/clients");
  return { success: true, data: result, message: "Klient został usunięty" };
}

"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { type ClientFormData } from "~/features/crm/schemas/client-schema";
import { createClient } from "~/features/crm/server/services/clients.service";
import { type ActionResponse } from "~/lib/action-types";

import { type Client } from "../db/schema";

import { logger } from "./logger";
import { mapClientServiceError } from "./map-service-error";

export async function createClientAction(data: ClientFormData): ActionResponse<Client> {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.warn({ operation: "createClientAction" }, "Unauthenticated access attempt");
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const [error, client] = await createClient({ contractorId: userId, data });
  if (error) return mapClientServiceError(error);

  revalidatePath("/app/clients");
  return { success: true, data: client, message: "Klient został dodany" };
}

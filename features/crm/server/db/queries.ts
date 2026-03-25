import { eq } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import { db } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { clients, type Client } from "./schema";

const logger = createLogger({ module: "crm-db" });

export async function getClientsByContractor(contractorId: string): Promise<SupabaseServiceResult<Client[]>> {
  try {
    const rows = await db.select().from(clients).where(eq(clients.contractorId, contractorId));
    return [null, rows];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Client");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get clients");
    return [serviceError, null];
  }
}

export async function getClientById(id: string): Promise<SupabaseServiceResult<Client>> {
  try {
    const rows = await db.select().from(clients).where(eq(clients.id, id));
    const row = rows[0];

    if (!row) {
      const error = SupabaseServiceError.notFound("Client");
      logger.error({ id, errorCode: error.code }, "Client not found");
      return [error, null];
    }

    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Client");
    logger.error({ id, errorCode: serviceError.code }, "Failed to get client");
    return [serviceError, null];
  }
}

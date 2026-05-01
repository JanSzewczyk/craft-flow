import { eq } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import { db, type DbClient } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { clients, type Client } from "./schema";

const logger = createLogger({ module: "crm-db" });
const RESOURCE_NAME = "Client";

type ClientInput = Pick<Client, "name" | "email" | "phone" | "clerkUserId">;

export async function createClientByContractorId({
  contractorId,
  data,
  dbClient = db
}: {
  contractorId: string;
  data: ClientInput;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Client>> {
  try {
    const rows = await dbClient
      .insert(clients)
      .values({ contractorId, ...data })
      .returning();

    const row = rows[0];
    if (!row) {
      const error = SupabaseServiceError.unknown(`Failed to create ${RESOURCE_NAME} — no row returned`);
      logger.error({ contractorId, errorCode: error.code }, "Insert returned no rows");
      return [error, null];
    }

    logger.info({ contractorId, clientId: row.id }, "Created client");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to create client");
    return [serviceError, null];
  }
}

export async function updateClient({
  id,
  data,
  dbClient = db
}: {
  id: string;
  data: Partial<ClientInput>;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Client>> {
  try {
    const [row] = await dbClient
      .update(clients)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();

    if (!row) {
      const error = SupabaseServiceError.notFound(RESOURCE_NAME);
      logger.error({ id, errorCode: error.code }, "Update returned no rows");
      return [error, null];
    }

    logger.info({ id }, "Updated client");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ id, errorCode: serviceError.code }, "Failed to update client");
    return [serviceError, null];
  }
}

export async function deleteClient({
  id,
  dbClient = db
}: {
  id: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Client>> {
  try {
    const [row] = await dbClient.delete(clients).where(eq(clients.id, id)).returning();

    if (!row) {
      const error = SupabaseServiceError.notFound(RESOURCE_NAME);
      logger.error({ id, errorCode: error.code }, "Delete returned no rows");
      return [error, null];
    }

    logger.info({ id }, "Deleted client");
    return [null, row];
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "23503") {
      const fkError = new SupabaseServiceError({
        code: "fk_constraint",
        message: "Client has associated projects",
        isFkConstraint: true,
        isRetryable: false
      });
      logger.warn({ id, errorCode: fkError.code }, "Cannot delete client with associated projects");
      return [fkError, null];
    }
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ id, errorCode: serviceError.code }, "Failed to delete client");
    return [serviceError, null];
  }
}

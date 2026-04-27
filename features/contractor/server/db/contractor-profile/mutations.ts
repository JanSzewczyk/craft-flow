import { eq } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import { db, type DbClient } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { contractorProfile, type ContractorProfile } from "./schema";

const logger = createLogger({ module: "contractor-db" });
const RESOURCE_NAME = "ContractorProfile";

type UpsertData = Pick<ContractorProfile, "companyName" | "industry" | "email" | "phone" | "nip" | "regon"> &
  Partial<Pick<ContractorProfile, "brandColor" | "logoUrl" | "addressId">>;

export async function upsertContractorProfile({
  contractorId,
  data,
  dbClient = db
}: {
  contractorId: string;
  data: UpsertData;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<ContractorProfile>> {
  try {
    const rows = await dbClient
      .insert(contractorProfile)
      .values({ id: contractorId, ...data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: contractorProfile.id,
        set: { ...data, updatedAt: new Date() }
      })
      .returning();

    const row = rows[0];
    if (!row) {
      const error = SupabaseServiceError.unknown(`Failed to upsert ${RESOURCE_NAME} — no row returned`);
      logger.error({ contractorId, errorCode: error.code }, "Upsert returned no rows");
      return [error, null];
    }

    logger.info({ contractorId }, "Upserted contractor profile");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to upsert contractor profile");
    return [serviceError, null];
  }
}

export async function updateContractorProfile({
  contractorId,
  data,
  dbClient = db
}: {
  contractorId: string;
  data: Partial<UpsertData>;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<ContractorProfile>> {
  try {
    const [row] = await dbClient
      .update(contractorProfile)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(contractorProfile.id, contractorId))
      .returning();

    if (!row) {
      const error = SupabaseServiceError.notFound(RESOURCE_NAME);
      logger.error({ contractorId, errorCode: error.code }, "Update returned no rows");
      return [error, null];
    }

    logger.info({ contractorId }, "Updated contractor profile");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to update contractor profile");
    return [serviceError, null];
  }
}

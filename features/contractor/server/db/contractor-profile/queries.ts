import { cache } from "react";

import { type BuildQueryResult, eq } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import { db, type DbClient } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";
import { type TSchema } from "~/lib/supabase/types";

import { contractorProfile } from "./schema";

const logger = createLogger({ module: "contractor-db" });
const RESOURCE_NAME = "ContractorProfile";

export type ContractorProfile = BuildQueryResult<TSchema, TSchema["contractorProfile"], { with: { address: true } }>;

export async function getContractorProfile({
  contractorId,
  dbClient = db
}: {
  contractorId: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<ContractorProfile>> {
  try {
    const row = await dbClient.query.contractorProfile.findFirst({
      where: eq(contractorProfile.id, contractorId),
      with: { address: true }
    });

    if (!row) {
      const error = SupabaseServiceError.notFound(RESOURCE_NAME);
      logger.error({ contractorId, errorCode: error.code }, "Contractor profile not found");
      return [error, null];
    }

    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get contractor profile");
    return [serviceError, null];
  }
}

export const getCachedContractorProfile = cache(getContractorProfile);

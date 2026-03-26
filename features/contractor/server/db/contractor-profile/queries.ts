import { cache } from "react";

import { eq } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import { db } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { contractorProfile, type ContractorProfile } from "./schema";

const logger = createLogger({ module: "contractor-db" });
const RESOURCE_NAME = "ContractorProfile";

export async function getContractorProfile(contractorId: string): Promise<SupabaseServiceResult<ContractorProfile>> {
  try {
    const rows = await db.select().from(contractorProfile).where(eq(contractorProfile.id, contractorId));
    const row = rows[0];

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

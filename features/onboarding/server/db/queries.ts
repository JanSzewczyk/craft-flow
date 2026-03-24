import { cache } from "react";

import { eq } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import {
  categorizeSupabaseError,
  SupabaseServiceError,
  type SupabaseServiceResult
} from "~/lib/services/supabase/errors";
import { db } from "~/lib/supabase/db";

import { onboardingState, type OnboardingState } from "./schema";

const logger = createLogger({ module: "onboarding-db" });
const RESOURCE_NAME = "OnboardingState";

export async function getOnboardingState(contractorId: string): Promise<SupabaseServiceResult<OnboardingState>> {
  try {
    const rows = await db.select().from(onboardingState).where(eq(onboardingState.contractorId, contractorId));
    const row = rows[0];
    if (!row) {
      const error = SupabaseServiceError.notFound(RESOURCE_NAME);
      logger.error({ contractorId, errorCode: error.code }, "Onboarding State not found");
      return [error, null];
    }
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get onboarding state");
    return [serviceError, null];
  }
}

export const getCachedOnboardingState = cache(getOnboardingState);

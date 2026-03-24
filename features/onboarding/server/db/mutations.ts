import { eq } from "drizzle-orm";

import { type OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { createLogger } from "~/lib/logger";
import {
  SupabaseServiceError,
  categorizeSupabaseError,
  type SupabaseServiceResult
} from "~/lib/services/supabase/errors";
import { db } from "~/lib/supabase/db";

import { type OnboardingState, onboardingState } from "./schema";

const logger = createLogger({ module: "onboarding-db" });

export async function createOnboardingState(
  contractorId: string,
  currentStep: OnboardingStep
): Promise<SupabaseServiceResult<OnboardingState>> {
  try {
    const rows = await db
      .insert(onboardingState)
      .values({
        contractorId,
        currentStep,
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: onboardingState.contractorId,
        set: {
          currentStep,
          updatedAt: new Date()
        }
      })
      .returning();

    const row = rows[0];
    if (!row) {
      const error = SupabaseServiceError.unknown("Failed to create onboarding state — no row returned");
      logger.error({ contractorId, errorCode: error.code }, "Insert returned no rows");
      return [error, null];
    }

    logger.info({ contractorId, currentStep }, "Created onboarding state");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "OnboardingState");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to create onboarding state");
    return [serviceError, null];
  }
}

export async function updateStepData(
  contractorId: string,
  stepData: Partial<
    Pick<OnboardingState, "currentStep" | "branding" | "companyDetails" | "emailConfig" | "templateConfig">
  >
): Promise<SupabaseServiceResult<OnboardingState>> {
  try {
    const [row] = await db
      .update(onboardingState)
      .set({
        ...stepData,
        updatedAt: new Date()
      })
      .where(eq(onboardingState.contractorId, contractorId))
      .returning();

    if (!row) {
      const error = SupabaseServiceError.unknown("Failed to update onboarding state — no row returned");
      logger.error({ contractorId, errorCode: error.code }, "Update returned no rows");
      return [error, null];
    }

    logger.info({ contractorId }, "Updated step data");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "OnboardingState");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to update step data");
    return [serviceError, null];
  }
}

export async function markOnboardingComplete(contractorId: string): Promise<SupabaseServiceResult<OnboardingState>> {
  try {
    const [row] = await db
      .update(onboardingState)
      .set({
        completed: true,
        completedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(onboardingState.contractorId, contractorId))
      .returning();

    if (!row) {
      const error = SupabaseServiceError.unknown("Failed to mark onboarding state as complete — no row returned");
      logger.error({ contractorId, errorCode: error.code }, "Update returned no rows");
      return [error, null];
    }

    logger.info({ contractorId }, "Marked onboarding complete");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "OnboardingState");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to mark onboarding complete");
    return [serviceError, null];
  }
}

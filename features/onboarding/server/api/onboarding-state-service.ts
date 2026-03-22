import "server-only";

import { cache } from "react";

import { eq } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import {
  categorizeSupabaseError,
  SupabaseServiceError,
  type SupabaseServiceResult
} from "~/lib/services/supabase/errors";
import { db } from "~/lib/supabase/db";
import { onboardingState } from "~/lib/supabase/schema";

const logger = createLogger({ module: "onboarding-db" });
const RESOURCE_NAME = "OnboardingState";

type OnboardingState = typeof onboardingState.$inferSelect;

export async function getOnboardingState(contractorId: string): Promise<SupabaseServiceResult<OnboardingState>> {
  try {
    const rows = await db.select().from(onboardingState).where(eq(onboardingState.contractorId, contractorId));
    const row = rows[0];
    if (!row) {
      const error = SupabaseServiceError.notFound(RESOURCE_NAME);
      logger.error({ contractorId, errorCode: error.code }, "Onboarding document not found after update");
      return [error, null];
    }
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get onboarding state");
    return [serviceError, null];
  }
}

export async function upsertOnboardingState(
  contractorId: string,
  currentStep: string,
  formData?: Record<string, unknown>
): Promise<SupabaseServiceResult<void>> {
  try {
    await db
      .insert(onboardingState)
      .values({
        contractorId,
        currentStep,
        formData: formData ?? {},
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: onboardingState.contractorId,
        set: {
          currentStep,
          ...(formData !== undefined ? { formData } : {}),
          updatedAt: new Date()
        }
      });

    logger.info({ contractorId, currentStep }, "Upserted onboarding state");
    return [null, undefined];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "OnboardingState");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to upsert onboarding state");
    return [serviceError, null];
  }
}

export async function updateStepData(
  contractorId: string,
  nextStep: string,
  partialFormData: Record<string, unknown>
): Promise<SupabaseServiceResult<void>> {
  try {
    const [getError, existing] = await getOnboardingState(contractorId);
    if (getError) return [getError, null];

    const currentFormData = (existing.formData as Record<string, unknown>) ?? {};
    const mergedFormData = { ...currentFormData, ...partialFormData };

    await db
      .insert(onboardingState)
      .values({
        contractorId,
        currentStep: nextStep,
        formData: mergedFormData,
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: onboardingState.contractorId,
        set: {
          currentStep: nextStep,
          formData: mergedFormData,
          updatedAt: new Date()
        }
      });

    logger.info({ contractorId, nextStep }, "Updated step data");
    return [null, undefined];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "OnboardingState");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to update step data");
    return [serviceError, null];
  }
}

export async function markOnboardingComplete(contractorId: string): Promise<SupabaseServiceResult<void>> {
  try {
    await db
      .update(onboardingState)
      .set({
        completed: true,
        completedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(onboardingState.contractorId, contractorId));

    logger.info({ contractorId }, "Marked onboarding complete");
    return [null, undefined];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "OnboardingState");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to mark onboarding complete");
    return [serviceError, null];
  }
}

export const getCachedOnboardingState = cache(getOnboardingState);

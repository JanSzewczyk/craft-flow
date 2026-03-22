import "server-only";

import { eq } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import { categorizeSupabaseError, type SupabaseServiceResult } from "~/lib/services/supabase/errors";
import { db } from "~/lib/supabase/db";
import { onboardingState } from "~/lib/supabase/schema";

const logger = createLogger({ module: "onboarding" });

type OnboardingStateRow = typeof onboardingState.$inferSelect;

export async function getOnboardingState(
  contractorId: string
): Promise<SupabaseServiceResult<OnboardingStateRow | null>> {
  try {
    const rows = await db.select().from(onboardingState).where(eq(onboardingState.contractorId, contractorId));
    const row = rows[0] ?? null;
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "OnboardingState");
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

    const currentFormData = (existing?.formData as Record<string, unknown>) ?? {};
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

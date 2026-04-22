import { cache } from "react";

import { type PhotoResolution, type Plan, PlanId, PLANS } from "~/features/billing/constants";
import { detectClerkPlan } from "~/features/billing/server/api/detect-clerk-plan";
import { SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

const plansMap = new Map<PlanId, Plan>(PLANS.map((plan) => [plan.id, plan]));

const validPlanIds = new Set<string>(Object.values(PlanId));

export function getPlanById(planId: PlanId): Plan | null {
  return plansMap.get(planId) ?? null;
}

export function isValidPlanId(value: string): value is PlanId {
  return validPlanIds.has(value);
}

// Utility

export function getPlanIds(): PlanId[] {
  return Object.values(PlanId);
}

// Plan capabilities

export type PlanFeatureFlags = {
  branding: boolean;
  whitelabelEmails: boolean;
};

export type PlanLimitValues = {
  projectsPerMonth: number | null;
  templates: number | null;
  photosPerProject: number | null;
  photoResolution: PhotoResolution;
  supportResponseHours: number | null;
};

export type PlanCapabilities = {
  plan: Plan;
  features: PlanFeatureFlags;
  limitations: PlanLimitValues;
};

export async function getPlanFeatures(): Promise<PlanCapabilities> {
  const [, plan] = await getUserPlan();
  if (!plan) {
    throw new Error("User plan not found");
  }
  const limits = plan.limits;
  return {
    plan,
    features: {
      branding: limits.branding,
      whitelabelEmails: limits.whitelabelEmails
    },
    limitations: {
      projectsPerMonth: limits.projectsPerMonth,
      templates: limits.templates,
      photosPerProject: limits.photosPerProject,
      photoResolution: limits.photoResolution,
      supportResponseHours: limits.supportResponseHours
    }
  };
}

export const getUserPlan = cache(async function (): Promise<SupabaseServiceResult<Plan>> {
  const planId = (await detectClerkPlan()) ?? PlanId.BASIC;
  const plan = plansMap.get(planId);
  if (!plan) {
    return [SupabaseServiceError.notFound("Plan"), null];
  }
  return [null, plan];
});

import { type PhotoResolution, type Plan, PlanId, PLANS } from "~/features/billing/constants";
import { detectClerkPlan } from "~/features/billing/server/api/detect-clerk-plan";

const plansMap = new Map<string, Plan>(PLANS.map((plan) => [plan.id, plan]));

const validPlanIds = new Set<string>(Object.values(PlanId));

export function getPlanById(planId: PlanId): Plan | undefined {
  return plansMap.get(planId);
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
  features: PlanFeatureFlags;
  limitations: PlanLimitValues;
};

export async function getPlanFeatures(): Promise<PlanCapabilities> {
  const planId = (await detectClerkPlan()) ?? PlanId.BASIC;
  const limits = plansMap.get(planId)?.limits ?? plansMap.get(PlanId.BASIC)!.limits;
  return {
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

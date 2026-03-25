import { type PhotoResolution, type Plan, PlanId, PLANS } from "~/features/billing/constants";

const plansMap = new Map<string, Plan>(PLANS.map((plan) => [plan.id, plan]));

const validPlanIds = new Set<string>(Object.values(PlanId));

export function getPlanById(planId: PlanId): Plan | undefined {
  return plansMap.get(planId);
}

export function isValidPlanId(value: string): value is PlanId {
  return validPlanIds.has(value);
}

// Feature checks

export function planHasBranding(planId: PlanId): boolean {
  return plansMap.get(planId)?.limits.branding ?? false;
}

export function canUseWhitelabelEmails(planId: PlanId): boolean {
  return plansMap.get(planId)?.limits.whitelabelEmails ?? false;
}

// Limit queries

export function getProjectLimit(planId: PlanId): number | null {
  return plansMap.get(planId)?.limits.projectsPerMonth ?? null;
}

export function getTemplateLimit(planId: PlanId): number | null {
  return plansMap.get(planId)?.limits.templates ?? null;
}

export function getPhotoLimit(planId: PlanId): number | null {
  return plansMap.get(planId)?.limits.photosPerProject ?? null;
}

export function getPhotoResolution(planId: PlanId): PhotoResolution | undefined {
  return plansMap.get(planId)?.limits.photoResolution;
}

// Utility

export function getPlanIds(): PlanId[] {
  return Object.values(PlanId);
}

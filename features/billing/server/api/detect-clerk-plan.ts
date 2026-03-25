import { cache } from "react";

import { auth } from "@clerk/nextjs/server";
import { type PlanId, PLANS } from "~/features/billing/constants";

/**
 * Clerk plan slugs mapped from plan definitions.
 */
const clerkSlugToPlanId = new Map<string, PlanId>(PLANS.map((plan) => [plan.clerkSlug, plan.id]));

/**
 * Detects the user's active plan from Clerk Billing subscriptions.
 * Checks plans in descending order (premium → standard → basic)
 * so the highest active plan wins.
 */
async function _detectClerkPlan(): Promise<PlanId | null> {
  const { has } = await auth();

  // Check in descending priority order
  for (const plan of [...PLANS].reverse()) {
    if (has({ plan: plan.clerkSlug })) {
      return clerkSlugToPlanId.get(plan.clerkSlug) ?? null;
    }
  }

  return null;
}

export const detectClerkPlan = cache(_detectClerkPlan);

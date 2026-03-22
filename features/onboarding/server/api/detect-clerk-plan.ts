import "server-only";

import { auth } from "@clerk/nextjs/server";
import { CLERK_PLAN_SLUGS, Plan } from "~/features/onboarding/constants/plans";

/**
 * Detects the user's active plan from Clerk Billing subscriptions.
 * Checks plans in descending order (premium → standard → basic)
 * so the highest active plan wins.
 */
export async function detectClerkPlan(): Promise<Plan | null> {
  const { has } = await auth();

  if (has({ plan: CLERK_PLAN_SLUGS[Plan.PREMIUM] })) return Plan.PREMIUM;
  if (has({ plan: CLERK_PLAN_SLUGS[Plan.STANDARD] })) return Plan.STANDARD;
  if (has({ plan: CLERK_PLAN_SLUGS[Plan.BASIC] })) return Plan.BASIC;

  return null;
}

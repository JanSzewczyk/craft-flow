"use server";

import { redirect } from "next/navigation";
import { PLANS, type PlanId } from "~/features/billing";
import { getVisibleBillingPlans } from "~/features/billing/server";
import { type RedirectAction } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "pricing-page-actions" });

/**
 * Server action to handle plan selection from pricing page
 * Validates planId against Clerk billing plans and local plans list
 * Redirects to sign-up page with selected plan
 *
 * @param planId - The ID of the selected plan
 * @returns RedirectAction - redirects on success, returns error on failure
 */
export async function selectPlan(planId: string): RedirectAction {
  const [clerkError, clerkPlansResult] = await getVisibleBillingPlans();

  if (clerkError) {
    logger.error({ planId, error: clerkError }, "Error fetching billing plans from Clerk during plan selection");
    return {
      success: false,
      error: "Invalid plan selected. Please choose a valid plan."
    };
  }

  const clerkPlanIds = clerkPlansResult?.map((plan) => plan.slug) ?? [];
  const localPlanIds: PlanId[] = PLANS.map((plan) => plan.id);

  const isValidClerkPlan = clerkPlanIds.includes(planId);
  const isValidLocalPlan = localPlanIds.includes(planId as PlanId);

  if (!isValidLocalPlan) {
    logger.warn({ planId, localPlanIds, clerkPlanIds }, "Invalid plan ID provided - not in local plans list");
    return {
      success: false,
      error: "Invalid plan selected. Please choose a valid plan."
    };
  }

  if (!isValidClerkPlan && isValidLocalPlan && !clerkError) {
    logger.warn(
      { planId, localPlanIds, clerkPlanIds },
      "Plan ID valid in local config but not found in Clerk billing plans - using local config"
    );
  }

  logger.info({ planId, isValidClerkPlan, isValidLocalPlan }, "Plan selected, redirecting to sign-up");

  redirect(`/sign-up?plan=${planId}`);
}

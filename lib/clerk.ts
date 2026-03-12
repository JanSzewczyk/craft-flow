/**
 * Clerk server-side utilities for billing operations
 */

import { clerkClient } from "@clerk/nextjs/server";

/**
 * Fetches all available billing plans from Clerk
 * @returns Paginated list of billing plans
 */
export async function getBillingPlans() {
  const client = await clerkClient();
  return client.billing.getPlanList();
}

/**
 * Fetches billing plans for a specific payer type
 * @param payerType - "user" or "org"
 * @returns Paginated list of billing plans
 */
export async function getBillingPlansByPayerType(payerType: "user" | "org") {
  const client = await clerkClient();
  return client.billing.getPlanList({ payerType });
}

/**
 * Fetches user's current billing subscription
 * @param userId - The user ID
 * @returns User's billing subscription or null
 */
export async function getUserSubscription(userId: string) {
  const client = await clerkClient();
  return client.billing.getUserBillingSubscription(userId);
}

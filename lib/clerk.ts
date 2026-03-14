import { type BillingPlan } from "@clerk/backend";
import { clerkClient } from "@clerk/nextjs/server";
import { createLogger } from "~/lib/logger";
import { categorizeClerkError, type ClerkServiceResult } from "~/lib/services/clerk/errors";

const logger = createLogger({ module: "clerk-billing" });

/**
 * Fetches all available billing plans from Clerk
 * @returns Tuple [error, data] - error is null on success, data is null on error
 */
export async function getVisibleBillingPlans(): Promise<ClerkServiceResult<Array<BillingPlan>>> {
  try {
    const client = await clerkClient();
    const result = await client.billing.getPlanList({ payerType: "user" });
    const data = result.data.filter((plan) => plan.publiclyVisible);

    logger.debug({ totalCount: data.length }, "Fetched billing plans successfully");
    return [null, data];
  } catch (error) {
    const serviceError = categorizeClerkError(error, "Billing plans");
    logger.error(
      { errorCode: serviceError.code, isRetryable: serviceError.isRetryable, operation: "getBillingPlans" },
      "Failed to fetch billing plans"
    );
    return [serviceError, null];
  }
}

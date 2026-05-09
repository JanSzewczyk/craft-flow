import "server-only";

import { clerkClient } from "@clerk/nextjs/server";
import { PLANS } from "~/features/billing/constants/plans";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "billing-branding" });

export async function getContractorBrandingEnabled(contractorId: string): Promise<boolean> {
  try {
    const client = await clerkClient();
    const subscription = await client.billing.getUserBillingSubscription(contractorId);
    const activeItem = subscription.subscriptionItems.find((item) => !item.canceledAt && !item.endedAt);

    if (!activeItem?.planId) return false;

    const plan = PLANS.find((p) => p.clerkSlug === activeItem.planId);
    return plan?.limits.branding ?? false;
  } catch (err) {
    logger.warn({ contractorId, err }, "Failed to fetch branding plan from Clerk — defaulting to no branding");
    return false;
  }
}

import "server-only";

import { clerkClient } from "@clerk/nextjs/server";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "billing-period" });

export async function getBillingPeriodStart(userId: string): Promise<Date> {
  try {
    const client = await clerkClient();
    const subscription = await client.billing.getUserBillingSubscription(userId);
    const activeItem = subscription.subscriptionItems.find((item) => !item.canceledAt && !item.endedAt);
    if (activeItem?.periodStart) {
      return new Date(activeItem.periodStart);
    }
  } catch (_err) {
    logger.warn({ userId }, "Failed to fetch billing period from Clerk — using calendar month fallback");
  }

  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

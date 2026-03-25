import "server-only";

import { clerkClient } from "@clerk/nextjs/server";
import { categorizeClerkError, type ClerkServiceResult } from "~/lib/clerk/errors";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "auth" });

type UserMetadata = {
  roles: Array<string>;
  onboardingComplete: boolean;
};

export async function setUserMetadata(userId: string, metadata: UserMetadata): Promise<ClerkServiceResult<void>> {
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: metadata
    });
    logger.info({ userId }, "Set metadata for user");
    return [null, undefined];
  } catch (error) {
    const serviceError = categorizeClerkError(error, "User metadata");
    logger.error({ userId, errorCode: serviceError.code }, "Failed to set user metadata");
    return [serviceError, null];
  }
}

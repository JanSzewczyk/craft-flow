import "server-only";

import { clerkClient } from "@clerk/nextjs/server";
import { categorizeClerkError, type ClerkServiceResult } from "~/lib/clerk/errors";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "auth-api" });

/**
 * Finds an optional Clerk user by email address.
 * Returns [null, { id: string }] if found, [null, null] if not found.
 */
export async function findOptionalUserByEmail(email: string): Promise<ClerkServiceResult<{ id: string } | null>> {
  try {
    const client = await clerkClient();
    const users = await client.users.getUserList({ emailAddress: [email] });
    const foundUser = users.data[0];

    if (foundUser) {
      return [null, { id: foundUser.id }];
    }

    return [null, null];
  } catch (error) {
    const serviceError = categorizeClerkError(error, "User");
    logger.error({ email, errorCode: serviceError.code }, "Failed to find optional user by email");
    return [serviceError, null];
  }
}

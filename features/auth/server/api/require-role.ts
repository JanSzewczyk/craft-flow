import "server-only";

import { clerkClient } from "@clerk/nextjs/server";
import { type Role } from "~/features/auth/constants/roles";
import { categorizeClerkError, ClerkServiceError, type ClerkServiceResult } from "~/lib/clerk/errors";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "auth" });

/**
 * Require that the user holds at least one of the specified roles.
 * Returns a `ClerkServiceResult<void>` tuple — [error, null] if check fails, [null, undefined] on success.
 *
 * @example
 * const [roleErr] = await requireRole(userId, [Role.CONTRACTOR]);
 * if (roleErr) return [roleErr, null];
 */
export async function requireRole(userId: string, roles: Role[]): Promise<ClerkServiceResult<void>> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userRoles = user.publicMetadata.roles ?? [];

    if (!roles.some((r) => userRoles.includes(r))) {
      logger.warn({ userId, requiredRoles: roles }, "User missing required role");
      return [ClerkServiceError.permissionDenied(`Required roles: ${roles.join(", ")}`), null];
    }

    return [null, undefined];
  } catch (error) {
    const serviceError = categorizeClerkError(error, "User");
    logger.error({ userId, errorCode: serviceError.code }, "Failed to verify role");
    return [serviceError, null];
  }
}

import "server-only";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { type Role } from "~/features/auth/constants/roles";
import { categorizeClerkError, ClerkServiceError, type ClerkServiceResult } from "~/lib/clerk/errors";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "auth" });

/**
 * Require that the user holds at least one of the specified roles.
 * Returns a `ClerkServiceResult<void>` tuple — [error, null] if check fails, [null, undefined] on success.
 *
 * Reads roles from auth().sessionClaims first for performance, falling back to
 * clerkClient().users.getUser() only when the claim is absent.
 *
 * @example
 * const [roleErr] = await requireRole(userId, [Role.CONTRACTOR]);
 * if (roleErr) return [roleErr, null];
 */
export async function requireRole(userId: string, roles: Role[]): Promise<ClerkServiceResult<void>> {
  try {
    const { sessionClaims } = await auth();

    // Try to read roles from sessionClaims first
    let userRoles = sessionClaims?.roles ?? sessionClaims?.metadata?.roles ?? null;

    // Fall back to clerkClient if roles claim is absent
    if (userRoles === null) {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      userRoles = user.publicMetadata.roles ?? [];
    }

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

/**
 * Clerk service error handling
 * Implements ServiceError contract for Clerk API errors
 */

import { isClerkAPIResponseError, isNetworkError } from "@clerk/shared/error";
import { createLogger } from "~/lib/logger";
import { BaseServiceError, type ServiceErrorOptions, type ServiceResult } from "~/lib/services/errors";

const clerkLogger = createLogger({ module: "clerk" });

/**
 * Service error contract for Clerk operations
 */
export class ClerkServiceError extends BaseServiceError {
  readonly _tag = "ClerkServiceError" as const;

  constructor(options: ServiceErrorOptions) {
    super("ClerkServiceError", options);
  }

  // Static factory methods following ServiceError contract

  static notFound(resourceName: string): ClerkServiceError {
    return new ClerkServiceError({
      code: "not_found",
      message: `${resourceName} not found`,
      isNotFound: true,
      isRetryable: false
    });
  }

  static alreadyExists(resourceName: string): ClerkServiceError {
    return new ClerkServiceError({
      code: "already_exists",
      message: `${resourceName} already exists`,
      isAlreadyExists: true,
      isRetryable: false
    });
  }

  static validation(message: string): ClerkServiceError {
    return new ClerkServiceError({
      code: "validation",
      message,
      isRetryable: false
    });
  }

  static permissionDenied(resourceName?: string): ClerkServiceError {
    return new ClerkServiceError({
      code: "permission_denied",
      message: resourceName ? `Permission denied for ${resourceName}` : "Permission denied",
      isPermissionDenied: true,
      isRetryable: false
    });
  }

  static unauthorized(): ClerkServiceError {
    return new ClerkServiceError({
      code: "unauthorized",
      message: "Unauthorized access",
      isPermissionDenied: true,
      isRetryable: false
    });
  }

  static rateLimit(): ClerkServiceError {
    return new ClerkServiceError({
      code: "rate_limit",
      message: "Rate limit exceeded",
      isRetryable: true
    });
  }

  static network(message: string = "Network error"): ClerkServiceError {
    return new ClerkServiceError({
      code: "network",
      message,
      isRetryable: true
    });
  }

  static unknown(message: string = "An unexpected error occurred"): ClerkServiceError {
    return new ClerkServiceError({
      code: "unknown",
      message,
      isRetryable: false
    });
  }

  static fromClerkError(error: unknown, resourceName?: string): ClerkServiceError {
    if (isClerkAPIResponseError(error)) {
      clerkLogger.error(
        {
          statusCode: error.status,
          clerkTraceId: error.clerkTraceId,
          error: error.message,
          errors: error.errors
        },
        "Clerk API error"
      );

      if (error.status === 404) {
        return new ClerkServiceError({
          code: "not_found",
          message: error.errors[0]?.message || `${resourceName || "Resource"} not found`,
          isNotFound: true,
          isRetryable: false,
          cause: error
        });
      }

      if (error.status === 409) {
        return new ClerkServiceError({
          code: "already_exists",
          message: error.errors[0]?.message || `${resourceName || "Resource"} already exists`,
          isAlreadyExists: true,
          isRetryable: false,
          cause: error
        });
      }

      if (error.status === 401 || error.status === 403) {
        return new ClerkServiceError({
          code: error.status === 401 ? "unauthorized" : "permission_denied",
          message: error.errors[0]?.message || "Permission denied",
          isPermissionDenied: true,
          isRetryable: false,
          cause: error
        });
      }

      if (error.status === 429) {
        return new ClerkServiceError({
          code: "rate_limit",
          message: error.errors[0]?.message || "Rate limit exceeded",
          isRetryable: true,
          cause: error
        });
      }

      // 4xx errors (client errors)
      if (error.status >= 400 && error.status < 500) {
        return new ClerkServiceError({
          code: "validation",
          message: error.errors[0]?.message || "Invalid request",
          isRetryable: false,
          cause: error
        });
      }

      // 5xx errors (server errors) - retryable
      if (error.status >= 500) {
        return new ClerkServiceError({
          code: "server_error",
          message: error.errors[0]?.message || "Server error",
          isRetryable: true,
          cause: error
        });
      }
    }

    // Check for network errors
    if (error instanceof Error && isNetworkError(error)) {
      return new ClerkServiceError({
        code: "network",
        message: error.message,
        isRetryable: true,
        cause: error
      });
    }

    // Unknown error
    return new ClerkServiceError({
      code: "unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      isRetryable: false,
      cause: error
    });
  }
}

/**
 * Type guard for ClerkServiceError
 */
export function isClerkServiceError(error: unknown): error is ClerkServiceError {
  return error instanceof ClerkServiceError;
}

/**
 * Categorize Clerk error and return ClerkServiceError
 * This is the main entry point for error categorization
 */
export function categorizeClerkError(error: unknown, resourceName?: string): ClerkServiceError {
  if (isClerkServiceError(error)) {
    return error;
  }

  return ClerkServiceError.fromClerkError(error, resourceName);
}

/**
 * Tuple type for Clerk service layer operations
 */
export type ClerkServiceResult<T> = ServiceResult<ClerkServiceError, T>;

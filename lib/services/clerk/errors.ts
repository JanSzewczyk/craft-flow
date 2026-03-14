/**
 * Clerk service error handling
 * Implements ServiceError contract for Clerk API errors
 */

import { isClerkAPIResponseError, isNetworkError } from "@clerk/shared/error";
import logger from "~/lib/logger";

const clerkLogger = createLogger({ module: "clerk" });

/**
 * Service error contract for Clerk operations
 */
export class ClerkServiceError extends Error {
  readonly _tag = "ClerkServiceError";

  /**
   * Error code for categorization
   */
  readonly code: string;

  /**
   * Whether the error is retryable (transient)
   */
  readonly isRetryable: boolean;

  /**
   * Whether the error indicates a resource was not found
   */
  readonly isNotFound: boolean;

  /**
   * Whether the error indicates a resource already exists
   */
  readonly isAlreadyExists: boolean;

  /**
   * Whether the error is a permission/authorization issue
   */
  readonly isPermissionDenied: boolean;

  constructor(options: {
    code: string;
    message: string;
    isRetryable?: boolean;
    isNotFound?: boolean;
    isAlreadyExists?: boolean;
    isPermissionDenied?: boolean;
    cause?: unknown;
  }) {
    super(options.message);
    this.name = "ClerkServiceError";
    this.code = options.code;
    this.isRetryable = options.isRetryable ?? false;
    this.isNotFound = options.isNotFound ?? false;
    this.isAlreadyExists = options.isAlreadyExists ?? false;
    this.isPermissionDenied = options.isPermissionDenied ?? false;

    if (options.cause) {
      this.cause = options.cause;
    }
  }

  // Static factory methods following ServiceError contract

  /**
   * Not found error
   */
  static notFound(resourceName: string): ClerkServiceError {
    return new ClerkServiceError({
      code: "not_found",
      message: `${resourceName} not found`,
      isNotFound: true,
      isRetryable: false
    });
  }

  /**
   * Already exists error
   */
  static alreadyExists(resourceName: string): ClerkServiceError {
    return new ClerkServiceError({
      code: "already_exists",
      message: `${resourceName} already exists`,
      isAlreadyExists: true,
      isRetryable: false
    });
  }

  /**
   * Validation error
   */
  static validation(message: string): ClerkServiceError {
    return new ClerkServiceError({
      code: "validation",
      message,
      isRetryable: false
    });
  }

  /**
   * Permission denied error
   */
  static permissionDenied(resourceName?: string): ClerkServiceError {
    return new ClerkServiceError({
      code: "permission_denied",
      message: resourceName ? `Permission denied for ${resourceName}` : "Permission denied",
      isPermissionDenied: true,
      isRetryable: false
    });
  }

  /**
   * Unauthorized error
   */
  static unauthorized(): ClerkServiceError {
    return new ClerkServiceError({
      code: "unauthorized",
      message: "Unauthorized access",
      isPermissionDenied: true,
      isRetryable: false
    });
  }

  /**
   * Rate limit error
   */
  static rateLimit(): ClerkServiceError {
    return new ClerkServiceError({
      code: "rate_limit",
      message: "Rate limit exceeded",
      isRetryable: true
    });
  }

  /**
   * Network error
   */
  static network(message: string = "Network error"): ClerkServiceError {
    return new ClerkServiceError({
      code: "network",
      message,
      isRetryable: true
    });
  }

  /**
   * Unknown/unexpected error
   */
  static unknown(message: string = "An unexpected error occurred"): ClerkServiceError {
    return new ClerkServiceError({
      code: "unknown",
      message,
      isRetryable: false
    });
  }

  /**
   * Create from Clerk API error
   */
  static fromClerkError(error: unknown, resourceName?: string): ClerkServiceError {
    if (isClerkAPIResponseError(error)) {
      // Log the Clerk API error with context
      clerkLogger.error(
        {
          statusCode: error.status,
          clerkTraceId: error.clerkTraceId,
          error: error.message,
          errors: error.errors
        },
        "Clerk API error"
      );

      // Map status codes to error types
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
 * Helper function to create logger with context
 */
function createLogger(context: Record<string, unknown>) {
  return {
    error: (data: Record<string, unknown>, message: string) => {
      logger.error({ ...context, ...data }, message);
    },
    warn: (data: Record<string, unknown>, message: string) => {
      logger.warn({ ...context, ...data }, message);
    },
    info: (data: Record<string, unknown>, message: string) => {
      logger.info({ ...context, ...data }, message);
    }
  };
}

/**
 * Tuple type for service layer operations
 * [error, data] - if error is null, data is valid, and vice versa
 */
export type ClerkServiceResult<T> = [ClerkServiceError, null] | [null, T];

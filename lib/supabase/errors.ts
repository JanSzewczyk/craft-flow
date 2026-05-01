/**
 * Supabase service error handling
 * Implements ServiceError contract for Supabase/Postgres errors
 */

import { createLogger } from "~/lib/logger";
import { BaseServiceError, type ServiceErrorOptions, type ServiceResult } from "~/lib/services/errors";

const logger = createLogger({ module: "supabase" });

/**
 * Service error contract for Supabase operations
 */
export class SupabaseServiceError extends BaseServiceError {
  readonly _tag = "SupabaseServiceError" as const;

  constructor(options: ServiceErrorOptions) {
    super("SupabaseServiceError", options);
  }

  // Static factory methods following ServiceError contract

  static notFound(resourceName: string): SupabaseServiceError {
    return new SupabaseServiceError({
      code: "not_found",
      message: `${resourceName} not found`,
      isNotFound: true,
      isRetryable: false
    });
  }

  static alreadyExists(resourceName: string): SupabaseServiceError {
    return new SupabaseServiceError({
      code: "already_exists",
      message: `${resourceName} already exists`,
      isAlreadyExists: true,
      isRetryable: false
    });
  }

  static validation(message: string): SupabaseServiceError {
    return new SupabaseServiceError({
      code: "validation",
      message,
      isValidation: true,
      isRetryable: false
    });
  }

  static unknown(message: string = "An unexpected error occurred"): SupabaseServiceError {
    return new SupabaseServiceError({
      code: "unknown",
      message,
      isRetryable: false
    });
  }

  static limitExceeded(max: number): SupabaseServiceError {
    return new SupabaseServiceError({
      code: "limit_exceeded",
      message: `Resource limit of ${max} exceeded`,
      isLimitExceeded: true,
      isRetryable: false,
      meta: { max }
    });
  }

  static unauthorized(): SupabaseServiceError {
    return new SupabaseServiceError({
      code: "unauthorized",
      message: "Access denied to this resource",
      isPermissionDenied: true,
      isRetryable: false
    });
  }

  static connection(message: string = "Database connection error"): SupabaseServiceError {
    return new SupabaseServiceError({
      code: "connection",
      message,
      isRetryable: true
    });
  }

  static fromPostgresError(error: unknown, resourceName: string = "Resource"): SupabaseServiceError {
    if (error && typeof error === "object" && "code" in error) {
      const pgError = error as { code: string; message?: string };
      const pgCode = pgError.code;

      logger.error({ pgCode, errorMessage: pgError.message, resourceName }, "Postgres error");

      // 23505 - unique_violation → alreadyExists
      if (pgCode === "23505") {
        return new SupabaseServiceError({
          code: "already_exists",
          message: `${resourceName} already exists`,
          isAlreadyExists: true,
          isRetryable: false,
          cause: error
        });
      }

      // 23503 - foreign_key_violation → validation
      if (pgCode === "23503") {
        return new SupabaseServiceError({
          code: "validation",
          message: `Invalid reference in ${resourceName}`,
          isValidation: true,
          isRetryable: false,
          cause: error
        });
      }

      // 42P01 - undefined_table → notFound (relation doesn't exist)
      if (pgCode === "42P01") {
        return new SupabaseServiceError({
          code: "not_found",
          message: `${resourceName} relation not found`,
          isNotFound: true,
          isRetryable: false,
          cause: error
        });
      }

      // 08xxx - connection errors → connection
      if (pgCode.startsWith("08")) {
        return new SupabaseServiceError({
          code: "connection",
          message: "Database connection error",
          isRetryable: true,
          cause: error
        });
      }
    }

    // Fallback for unknown errors
    const message = error instanceof Error ? error.message : "Unknown database error";
    logger.error({ errorMessage: message, resourceName }, "Unknown database error");
    return new SupabaseServiceError({
      code: "unknown",
      message,
      isRetryable: false,
      cause: error
    });
  }
}

/**
 * Type guard for SupabaseServiceError
 */
export function isSupabaseServiceError(error: unknown): error is SupabaseServiceError {
  return error instanceof SupabaseServiceError;
}

/**
 * Categorize a Supabase/Postgres error and return a SupabaseServiceError
 * This is the main entry point for error categorization in DB query functions
 */
export function categorizeSupabaseError(error: unknown, resourceName: string = "Resource"): SupabaseServiceError {
  if (isSupabaseServiceError(error)) {
    return error;
  }

  return SupabaseServiceError.fromPostgresError(error, resourceName);
}

/**
 * Tuple type for Supabase service layer operations
 */
export type SupabaseServiceResult<T> = ServiceResult<T, SupabaseServiceError>;

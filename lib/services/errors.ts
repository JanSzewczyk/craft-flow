/**
 * Base service error contract shared across all service layers (Supabase, Clerk, etc.)
 */
export type ServiceErrorOptions = {
  code: string;
  message: string;
  isRetryable?: boolean;
  isNotFound?: boolean;
  isAlreadyExists?: boolean;
  isPermissionDenied?: boolean;
  isValidation?: boolean;
  isLimitExceeded?: boolean;
  isFkConstraint?: boolean;
  cause?: unknown;
  meta?: Record<string, unknown>;
};

export abstract class BaseServiceError extends Error {
  abstract readonly _tag: string;

  readonly code: string;
  readonly isRetryable: boolean;
  readonly isNotFound: boolean;
  readonly isAlreadyExists: boolean;
  readonly isPermissionDenied: boolean;
  readonly isValidation: boolean;
  readonly isLimitExceeded: boolean;
  readonly isFkConstraint: boolean;
  readonly meta: Record<string, unknown>;

  constructor(name: string, options: ServiceErrorOptions) {
    super(options.message);
    this.name = name;
    this.code = options.code;
    this.isRetryable = options.isRetryable ?? false;
    this.isNotFound = options.isNotFound ?? false;
    this.isAlreadyExists = options.isAlreadyExists ?? false;
    this.isPermissionDenied = options.isPermissionDenied ?? false;
    this.isValidation = options.isValidation ?? false;
    this.isLimitExceeded = options.isLimitExceeded ?? false;
    this.isFkConstraint = options.isFkConstraint ?? false;
    this.meta = options.meta ?? {};

    if (options.cause) {
      this.cause = options.cause;
    }
  }
}

/**
 * Tuple type for service layer operations
 * [error, data] - if error is null, data is valid, and vice versa
 */
export type ServiceResult<T, E extends BaseServiceError = BaseServiceError> = [E, null] | [null, T];

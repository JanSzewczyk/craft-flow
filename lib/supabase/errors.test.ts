vi.mock("~/lib/logger", () => {
  const noop = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), child: vi.fn() };
  noop.child.mockReturnValue(noop);
  return { default: noop, createLogger: vi.fn(() => noop) };
});

import { categorizeSupabaseError, isSupabaseServiceError, SupabaseServiceError } from "./errors";

// ─── SupabaseServiceError factory methods ─────────────────────────────────────

describe("SupabaseServiceError", () => {
  describe("notFound", () => {
    test("creates error with not_found code", () => {
      const error = SupabaseServiceError.notFound("Template");
      expect(error.code).toBe("not_found");
      expect(error.isNotFound).toBe(true);
      expect(error.isRetryable).toBe(false);
      expect(error.message).toBe("Template not found");
    });

    test("includes resource name in message", () => {
      const error = SupabaseServiceError.notFound("Project");
      expect(error.message).toContain("Project");
    });
  });

  describe("alreadyExists", () => {
    test("creates error with already_exists code", () => {
      const error = SupabaseServiceError.alreadyExists("Client");
      expect(error.code).toBe("already_exists");
      expect(error.isAlreadyExists).toBe(true);
      expect(error.isRetryable).toBe(false);
      expect(error.message).toBe("Client already exists");
    });
  });

  describe("validation", () => {
    test("creates error with validation code", () => {
      const error = SupabaseServiceError.validation("Email is invalid");
      expect(error.code).toBe("validation");
      expect(error.isValidation).toBe(true);
      expect(error.isRetryable).toBe(false);
      expect(error.message).toBe("Email is invalid");
    });
  });

  describe("unknown", () => {
    test("creates error with unknown code and default message", () => {
      const error = SupabaseServiceError.unknown();
      expect(error.code).toBe("unknown");
      expect(error.isRetryable).toBe(false);
      expect(error.message).toBe("An unexpected error occurred");
    });

    test("creates error with custom message", () => {
      const error = SupabaseServiceError.unknown("Custom error");
      expect(error.message).toBe("Custom error");
    });

    test("all flags are false by default", () => {
      const error = SupabaseServiceError.unknown();
      expect(error.isNotFound).toBe(false);
      expect(error.isAlreadyExists).toBe(false);
      expect(error.isPermissionDenied).toBe(false);
      expect(error.isValidation).toBe(false);
      expect(error.isLimitExceeded).toBe(false);
    });
  });

  describe("limitExceeded", () => {
    test("creates error with limit_exceeded code", () => {
      const error = SupabaseServiceError.limitExceeded(5);
      expect(error.code).toBe("limit_exceeded");
      expect(error.isLimitExceeded).toBe(true);
      expect(error.isRetryable).toBe(false);
    });

    test("stores max value in meta", () => {
      const error = SupabaseServiceError.limitExceeded(10);
      expect(error.meta).toEqual({ max: 10 });
    });

    test("message includes max", () => {
      const error = SupabaseServiceError.limitExceeded(3);
      expect(error.message).toContain("3");
    });
  });

  describe("unauthorized", () => {
    test("creates error with unauthorized code", () => {
      const error = SupabaseServiceError.unauthorized();
      expect(error.code).toBe("unauthorized");
      expect(error.isPermissionDenied).toBe(true);
      expect(error.isRetryable).toBe(false);
    });
  });

  describe("connection", () => {
    test("creates error with connection code and default message", () => {
      const error = SupabaseServiceError.connection();
      expect(error.code).toBe("connection");
      expect(error.isRetryable).toBe(true);
      expect(error.message).toBe("Database connection error");
    });

    test("creates error with custom message", () => {
      const error = SupabaseServiceError.connection("Timeout");
      expect(error.message).toBe("Timeout");
    });
  });

  describe("fromPostgresError", () => {
    test("maps 23505 unique_violation to alreadyExists", () => {
      const pgError = { code: "23505", message: "duplicate key" };
      const error = SupabaseServiceError.fromPostgresError(pgError, "User");
      expect(error.code).toBe("already_exists");
      expect(error.isAlreadyExists).toBe(true);
    });

    test("maps 23503 foreign_key_violation to validation", () => {
      const pgError = { code: "23503", message: "fk violation" };
      const error = SupabaseServiceError.fromPostgresError(pgError, "Project");
      expect(error.code).toBe("validation");
      expect(error.isValidation).toBe(true);
    });

    test("maps 42P01 undefined_table to notFound", () => {
      const pgError = { code: "42P01", message: "relation does not exist" };
      const error = SupabaseServiceError.fromPostgresError(pgError, "Table");
      expect(error.code).toBe("not_found");
      expect(error.isNotFound).toBe(true);
    });

    test("maps 08xxx connection errors to connection (retryable)", () => {
      const pgError = { code: "08001", message: "connection refused" };
      const error = SupabaseServiceError.fromPostgresError(pgError, "DB");
      expect(error.code).toBe("connection");
      expect(error.isRetryable).toBe(true);
    });

    test("maps unknown pg error to unknown", () => {
      const pgError = { code: "99999", message: "something odd" };
      const error = SupabaseServiceError.fromPostgresError(pgError, "Resource");
      expect(error.code).toBe("unknown");
    });

    test("handles non-pg error objects", () => {
      const error = SupabaseServiceError.fromPostgresError(new Error("random error"), "Resource");
      expect(error.code).toBe("unknown");
      expect(error.message).toBe("random error");
    });

    test("handles null/undefined error", () => {
      const error = SupabaseServiceError.fromPostgresError(null, "Resource");
      expect(error.code).toBe("unknown");
    });
  });

  describe("is an instance of Error", () => {
    test("notFound is instanceof Error", () => {
      expect(SupabaseServiceError.notFound("X")).toBeInstanceOf(Error);
    });

    test("unknown is instanceof SupabaseServiceError", () => {
      expect(SupabaseServiceError.unknown()).toBeInstanceOf(SupabaseServiceError);
    });
  });
});

// ─── isSupabaseServiceError ───────────────────────────────────────────────────

describe("isSupabaseServiceError", () => {
  test("returns true for SupabaseServiceError instance", () => {
    expect(isSupabaseServiceError(SupabaseServiceError.notFound("X"))).toBe(true);
  });

  test("returns false for plain Error", () => {
    expect(isSupabaseServiceError(new Error("plain"))).toBe(false);
  });

  test("returns false for null", () => {
    expect(isSupabaseServiceError(null)).toBe(false);
  });

  test("returns false for plain object", () => {
    expect(isSupabaseServiceError({ code: "not_found" })).toBe(false);
  });
});

// ─── categorizeSupabaseError ──────────────────────────────────────────────────

describe("categorizeSupabaseError", () => {
  test("returns the original error if already a SupabaseServiceError", () => {
    const original = SupabaseServiceError.notFound("Template");
    const result = categorizeSupabaseError(original, "Template");
    expect(result).toBe(original);
  });

  test("wraps a postgres unique_violation error", () => {
    const pgError = { code: "23505", message: "duplicate" };
    const result = categorizeSupabaseError(pgError, "User");
    expect(result.code).toBe("already_exists");
    expect(result).toBeInstanceOf(SupabaseServiceError);
  });

  test("wraps a plain Error as unknown", () => {
    const result = categorizeSupabaseError(new Error("fail"), "Resource");
    expect(result.code).toBe("unknown");
  });

  test("uses default resource name when not provided", () => {
    const result = categorizeSupabaseError(new Error("fail"));
    expect(result).toBeInstanceOf(SupabaseServiceError);
  });
});

import { emailVerificationSchema } from "~/features/auth";
import { forgotPasswordSchema, forgotPasswordVerifySchema } from "~/features/auth";
import { signInSchema } from "./sign-in-schema";
import { signUpSchema } from "~/features/auth";

// ─── signInSchema ─────────────────────────────────────────────────────────────

describe("signInSchema", () => {
  const VALID = { email: "jan@example.com", password: "haslo123" };

  test("accepts a fully valid object", () => {
    expect(signInSchema.safeParse(VALID).success).toBe(true);
  });

  describe("email", () => {
    test("accepts valid email", () => {
      expect(signInSchema.safeParse({ ...VALID, email: "test@example.com" }).success).toBe(true);
    });

    test("rejects invalid email format", () => {
      const result = signInSchema.safeParse({ ...VALID, email: "not-an-email" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Podaj prawidłowy adres e-mail");
      }
    });

    test("rejects empty string", () => {
      const result = signInSchema.safeParse({ ...VALID, email: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("password", () => {
    test("accepts single character password", () => {
      expect(signInSchema.safeParse({ ...VALID, password: "x" }).success).toBe(true);
    });

    test("rejects empty string", () => {
      const result = signInSchema.safeParse({ ...VALID, password: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Hasło jest wymagane");
      }
    });
  });
});

// ─── signUpSchema ─────────────────────────────────────────────────────────────

describe("signUpSchema", () => {
  const VALID = {
    firstName: "Jan",
    lastName: "Kowalski",
    email: "jan@example.com",
    password: "haslo12345",
    confirmPassword: "haslo12345"
  };

  test("accepts a fully valid object", () => {
    expect(signUpSchema.safeParse(VALID).success).toBe(true);
  });

  describe("firstName", () => {
    test("accepts single character", () => {
      expect(signUpSchema.safeParse({ ...VALID, firstName: "J" }).success).toBe(true);
    });

    test("rejects empty string", () => {
      const result = signUpSchema.safeParse({ ...VALID, firstName: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Imię jest wymagane");
      }
    });
  });

  describe("lastName", () => {
    test("accepts single character", () => {
      expect(signUpSchema.safeParse({ ...VALID, lastName: "K" }).success).toBe(true);
    });

    test("rejects empty string", () => {
      const result = signUpSchema.safeParse({ ...VALID, lastName: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Nazwisko jest wymagane");
      }
    });
  });

  describe("email", () => {
    test("rejects invalid email format", () => {
      const result = signUpSchema.safeParse({ ...VALID, email: "not-an-email" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Podaj prawidłowy adres e-mail");
      }
    });
  });

  describe("password", () => {
    test("accepts exactly 8 characters (min boundary)", () => {
      expect(signUpSchema.safeParse({ ...VALID, password: "12345678", confirmPassword: "12345678" }).success).toBe(
        true
      );
    });

    test("rejects password shorter than 8 characters", () => {
      const result = signUpSchema.safeParse({ ...VALID, password: "1234567", confirmPassword: "1234567" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Hasło musi mieć co najmniej 8 znaków");
      }
    });
  });

  describe("confirmPassword", () => {
    test("rejects empty confirmPassword", () => {
      const result = signUpSchema.safeParse({ ...VALID, confirmPassword: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Potwierdzenie hasła jest wymagane");
      }
    });
  });

  describe("password cross-field validation", () => {
    test("rejects when password and confirmPassword do not match", () => {
      const result = signUpSchema.safeParse({ ...VALID, password: "haslo12345", confirmPassword: "innehashlo" });
      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmError = result.error.issues.find((i) => i.path.includes("confirmPassword"));
        expect(confirmError?.message).toBe("Hasła nie są zgodne");
      }
    });

    test("accepts when password and confirmPassword match", () => {
      expect(signUpSchema.safeParse({ ...VALID, password: "haslo12345", confirmPassword: "haslo12345" }).success).toBe(
        true
      );
    });
  });
});

// ─── forgotPasswordSchema ─────────────────────────────────────────────────────

describe("forgotPasswordSchema", () => {
  test("accepts valid email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "jan@example.com" }).success).toBe(true);
  });

  test("rejects invalid email format", () => {
    const result = forgotPasswordSchema.safeParse({ email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Podaj prawidłowy adres e-mail");
    }
  });

  test("rejects empty string", () => {
    const result = forgotPasswordSchema.safeParse({ email: "" });
    expect(result.success).toBe(false);
  });
});

// ─── forgotPasswordVerifySchema ───────────────────────────────────────────────

describe("forgotPasswordVerifySchema", () => {
  const VALID = {
    code: "123456",
    password: "nowehaslo123",
    confirmPassword: "nowehaslo123"
  };

  test("accepts a fully valid object", () => {
    expect(forgotPasswordVerifySchema.safeParse(VALID).success).toBe(true);
  });

  describe("code", () => {
    test("accepts exactly 6 digits", () => {
      expect(forgotPasswordVerifySchema.safeParse({ ...VALID, code: "000000" }).success).toBe(true);
    });

    test("rejects code shorter than 6 characters", () => {
      const result = forgotPasswordVerifySchema.safeParse({ ...VALID, code: "12345" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Kod musi mieć dokładnie 6 cyfr");
      }
    });

    test("rejects code longer than 6 characters", () => {
      const result = forgotPasswordVerifySchema.safeParse({ ...VALID, code: "1234567" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Kod musi mieć dokładnie 6 cyfr");
      }
    });

    test("rejects code with non-digit characters", () => {
      const result = forgotPasswordVerifySchema.safeParse({ ...VALID, code: "12345a" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Kod może zawierać tylko cyfry");
      }
    });
  });

  describe("password", () => {
    test("accepts exactly 8 characters (min boundary)", () => {
      expect(
        forgotPasswordVerifySchema.safeParse({ ...VALID, password: "12345678", confirmPassword: "12345678" }).success
      ).toBe(true);
    });

    test("rejects password shorter than 8 characters", () => {
      const result = forgotPasswordVerifySchema.safeParse({
        ...VALID,
        password: "1234567",
        confirmPassword: "1234567"
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Hasło musi mieć co najmniej 8 znaków");
      }
    });
  });

  describe("password cross-field validation", () => {
    test("rejects when passwords do not match", () => {
      const result = forgotPasswordVerifySchema.safeParse({
        ...VALID,
        password: "nowehaslo123",
        confirmPassword: "innehashlo"
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmError = result.error.issues.find((i) => i.path.includes("confirmPassword"));
        expect(confirmError?.message).toBe("Hasła nie są zgodne");
      }
    });

    test("accepts when passwords match", () => {
      expect(
        forgotPasswordVerifySchema.safeParse({
          ...VALID,
          password: "nowehaslo123",
          confirmPassword: "nowehaslo123"
        }).success
      ).toBe(true);
    });
  });
});

// ─── emailVerificationSchema ──────────────────────────────────────────────────

describe("emailVerificationSchema", () => {
  test("accepts exactly 6 digits", () => {
    expect(emailVerificationSchema.safeParse({ code: "123456" }).success).toBe(true);
  });

  test("accepts all-zeros code", () => {
    expect(emailVerificationSchema.safeParse({ code: "000000" }).success).toBe(true);
  });

  test("rejects code shorter than 6 characters", () => {
    const result = emailVerificationSchema.safeParse({ code: "12345" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Kod musi mieć dokładnie 6 cyfr");
    }
  });

  test("rejects code longer than 6 characters", () => {
    const result = emailVerificationSchema.safeParse({ code: "1234567" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Kod musi mieć dokładnie 6 cyfr");
    }
  });

  test("rejects code with non-digit characters", () => {
    const result = emailVerificationSchema.safeParse({ code: "12345a" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Kod może zawierać tylko cyfry");
    }
  });

  test("rejects empty string", () => {
    const result = emailVerificationSchema.safeParse({ code: "" });
    expect(result.success).toBe(false);
  });
});

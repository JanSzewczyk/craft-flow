import { contactFormSchema } from "./contact-schema";

const VALID_CONTACT = {
  name: "Jan Kowalski",
  email: "jan@example.com",
  subject: "demo" as const,
  message: "To jest przykładowa wiadomość testowa z co najmniej 20 znakami."
};

describe("contactFormSchema", () => {
  test("accepts a fully valid object", () => {
    expect(contactFormSchema.safeParse(VALID_CONTACT).success).toBe(true);
  });

  describe("name", () => {
    test("accepts exactly 2 characters (min boundary)", () => {
      expect(contactFormSchema.safeParse({ ...VALID_CONTACT, name: "AB" }).success).toBe(true);
    });

    test("accepts normal name", () => {
      expect(contactFormSchema.safeParse({ ...VALID_CONTACT, name: "Jan Kowalski" }).success).toBe(true);
    });

    test("accepts max 100 characters", () => {
      expect(contactFormSchema.safeParse({ ...VALID_CONTACT, name: "A".repeat(100) }).success).toBe(true);
    });

    test("rejects single character (below min)", () => {
      const result = contactFormSchema.safeParse({ ...VALID_CONTACT, name: "A" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Imię musi mieć co najmniej 2 znaki");
      }
    });

    test("rejects empty string", () => {
      const result = contactFormSchema.safeParse({ ...VALID_CONTACT, name: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Imię musi mieć co najmniej 2 znaki");
      }
    });

    test("rejects name longer than 100 characters", () => {
      const result = contactFormSchema.safeParse({ ...VALID_CONTACT, name: "A".repeat(101) });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Imię jest za długie");
      }
    });
  });

  describe("email", () => {
    test("accepts valid email", () => {
      expect(contactFormSchema.safeParse({ ...VALID_CONTACT, email: "test@example.com" }).success).toBe(true);
    });

    test("rejects invalid email format", () => {
      const result = contactFormSchema.safeParse({ ...VALID_CONTACT, email: "not-an-email" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Podaj prawidłowy adres e-mail");
      }
    });

    test("rejects email without domain", () => {
      const result = contactFormSchema.safeParse({ ...VALID_CONTACT, email: "test@" });
      expect(result.success).toBe(false);
    });
  });

  describe("subject", () => {
    test("accepts 'demo'", () => {
      expect(contactFormSchema.safeParse({ ...VALID_CONTACT, subject: "demo" }).success).toBe(true);
    });

    test("accepts 'pricing'", () => {
      expect(contactFormSchema.safeParse({ ...VALID_CONTACT, subject: "pricing" }).success).toBe(true);
    });

    test("accepts 'support'", () => {
      expect(contactFormSchema.safeParse({ ...VALID_CONTACT, subject: "support" }).success).toBe(true);
    });

    test("accepts 'other'", () => {
      expect(contactFormSchema.safeParse({ ...VALID_CONTACT, subject: "other" }).success).toBe(true);
    });

    test("rejects invalid enum value", () => {
      const result = contactFormSchema.safeParse({ ...VALID_CONTACT, subject: "invalid" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Wybierz temat");
      }
    });

    test("rejects empty string", () => {
      const result = contactFormSchema.safeParse({ ...VALID_CONTACT, subject: "" });
      expect(result.success).toBe(false);
    });
  });

  describe("message", () => {
    test("accepts exactly 20 characters (min boundary)", () => {
      expect(contactFormSchema.safeParse({ ...VALID_CONTACT, message: "A".repeat(20) }).success).toBe(true);
    });

    test("accepts max 2000 characters", () => {
      expect(contactFormSchema.safeParse({ ...VALID_CONTACT, message: "A".repeat(2000) }).success).toBe(true);
    });

    test("rejects message shorter than 20 characters", () => {
      const result = contactFormSchema.safeParse({ ...VALID_CONTACT, message: "Za krótka" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Wiadomość musi mieć co najmniej 20 znaków");
      }
    });

    test("rejects empty string", () => {
      const result = contactFormSchema.safeParse({ ...VALID_CONTACT, message: "" });
      expect(result.success).toBe(false);
    });

    test("rejects message longer than 2000 characters", () => {
      const result = contactFormSchema.safeParse({ ...VALID_CONTACT, message: "A".repeat(2001) });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Wiadomość jest za długa");
      }
    });
  });
});

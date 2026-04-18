import { describe, expect, test } from "vitest";

import { clientSchema } from "./client-schema";

describe("clientSchema", () => {
  describe("name", () => {
    test("accepts 2 characters", () => {
      expect(clientSchema.safeParse({ name: "AB", email: "test@example.com", phone: null }).success).toBe(true);
    });

    test("accepts max 255 characters", () => {
      expect(clientSchema.safeParse({ name: "A".repeat(255), email: "test@example.com", phone: null }).success).toBe(
        true
      );
    });

    test("rejects empty string", () => {
      const result = clientSchema.safeParse({ name: "", email: "test@example.com", phone: null });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Imię i nazwisko musi mieć co najmniej 2 znaki");
      }
    });

    test("rejects single character", () => {
      const result = clientSchema.safeParse({ name: "A", email: "test@example.com", phone: null });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Imię i nazwisko musi mieć co najmniej 2 znaki");
      }
    });

    test("rejects name longer than 255 characters", () => {
      const result = clientSchema.safeParse({ name: "A".repeat(256), email: "test@example.com", phone: null });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Imię i nazwisko nie może przekraczać 255 znaków");
      }
    });
  });

  describe("email", () => {
    test("accepts valid email", () => {
      expect(clientSchema.safeParse({ name: "Jan Kowalski", email: "jan@example.com", phone: null }).success).toBe(
        true
      );
    });

    test("rejects invalid email format", () => {
      const result = clientSchema.safeParse({ name: "Jan Kowalski", email: "not-an-email", phone: null });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Niepoprawny format adresu e-mail");
      }
    });

    test("rejects email longer than 255 characters", () => {
      const localPart = "a".repeat(244);
      const result = clientSchema.safeParse({ name: "Jan Kowalski", email: `${localPart}@example.com`, phone: null });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Adres e-mail nie może przekraczać 255 znaków");
      }
    });
  });

  describe("phone", () => {
    test("accepts null", () => {
      expect(clientSchema.safeParse({ name: "Jan Kowalski", email: "jan@example.com", phone: null }).success).toBe(
        true
      );
    });

    test("accepts valid phone string", () => {
      expect(
        clientSchema.safeParse({ name: "Jan Kowalski", email: "jan@example.com", phone: "+48 123 456 789" }).success
      ).toBe(true);
    });

    test("rejects phone longer than 50 characters", () => {
      const result = clientSchema.safeParse({
        name: "Jan Kowalski",
        email: "jan@example.com",
        phone: "1".repeat(51)
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Numer telefonu nie może przekraczać 50 znaków");
      }
    });
  });
});

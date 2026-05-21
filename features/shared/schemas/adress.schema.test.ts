import { addressSchema } from "./adress.schema";

const VALID_ADDRESS = {
  street: "ul. Przykładowa 12",
  postalCode: "00-001",
  city: "Warszawa",
  country: "Polska",
  additionalInfo: null
};

describe("addressSchema", () => {
  test("accepts a fully valid object", () => {
    expect(addressSchema.safeParse(VALID_ADDRESS).success).toBe(true);
  });

  test("accepts valid object with additionalInfo string", () => {
    expect(addressSchema.safeParse({ ...VALID_ADDRESS, additionalInfo: "Piętro 3, mieszkanie 12" }).success).toBe(true);
  });

  describe("street", () => {
    test("accepts single character", () => {
      expect(addressSchema.safeParse({ ...VALID_ADDRESS, street: "A" }).success).toBe(true);
    });

    test("accepts max 100 characters", () => {
      expect(addressSchema.safeParse({ ...VALID_ADDRESS, street: "A".repeat(100) }).success).toBe(true);
    });

    test("rejects empty string", () => {
      const result = addressSchema.safeParse({ ...VALID_ADDRESS, street: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Ulica jest wymagana");
      }
    });

    test("rejects street longer than 100 characters", () => {
      const result = addressSchema.safeParse({ ...VALID_ADDRESS, street: "A".repeat(101) });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Ulica nie może przekraczać 100 znaków");
      }
    });
  });

  describe("postalCode", () => {
    test("accepts valid Polish postal code format XX-XXX", () => {
      expect(addressSchema.safeParse({ ...VALID_ADDRESS, postalCode: "12-345" }).success).toBe(true);
    });

    test("accepts 00-000 boundary value", () => {
      expect(addressSchema.safeParse({ ...VALID_ADDRESS, postalCode: "00-000" }).success).toBe(true);
    });

    test("rejects empty string", () => {
      const result = addressSchema.safeParse({ ...VALID_ADDRESS, postalCode: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Kod pocztowy jest wymagany");
      }
    });

    test("rejects postal code without dash", () => {
      const result = addressSchema.safeParse({ ...VALID_ADDRESS, postalCode: "12345" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Nieprawidłowy kod pocztowy (wymagany format: XX-XXX)");
      }
    });

    test("rejects postal code with letters", () => {
      const result = addressSchema.safeParse({ ...VALID_ADDRESS, postalCode: "AB-CDE" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Nieprawidłowy kod pocztowy (wymagany format: XX-XXX)");
      }
    });

    test("rejects postal code with wrong dash position", () => {
      const result = addressSchema.safeParse({ ...VALID_ADDRESS, postalCode: "1-2345" });
      expect(result.success).toBe(false);
    });
  });

  describe("city", () => {
    test("accepts single character", () => {
      expect(addressSchema.safeParse({ ...VALID_ADDRESS, city: "A" }).success).toBe(true);
    });

    test("accepts max 100 characters", () => {
      expect(addressSchema.safeParse({ ...VALID_ADDRESS, city: "A".repeat(100) }).success).toBe(true);
    });

    test("rejects empty string", () => {
      const result = addressSchema.safeParse({ ...VALID_ADDRESS, city: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Miasto jest wymagane");
      }
    });

    test("rejects city longer than 100 characters", () => {
      const result = addressSchema.safeParse({ ...VALID_ADDRESS, city: "A".repeat(101) });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Nazwa miasta nie może przekraczać 100 znaków");
      }
    });
  });

  describe("country", () => {
    test("accepts single character", () => {
      expect(addressSchema.safeParse({ ...VALID_ADDRESS, country: "A" }).success).toBe(true);
    });

    test("accepts max 100 characters", () => {
      expect(addressSchema.safeParse({ ...VALID_ADDRESS, country: "A".repeat(100) }).success).toBe(true);
    });

    test("rejects empty string", () => {
      const result = addressSchema.safeParse({ ...VALID_ADDRESS, country: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Kraj jest wymagany");
      }
    });

    test("rejects country longer than 100 characters", () => {
      const result = addressSchema.safeParse({ ...VALID_ADDRESS, country: "A".repeat(101) });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Nazwa kraju nie może przekraczać 100 znaków");
      }
    });
  });

  describe("additionalInfo", () => {
    test("accepts null", () => {
      expect(addressSchema.safeParse({ ...VALID_ADDRESS, additionalInfo: null }).success).toBe(true);
    });

    test("accepts empty string", () => {
      expect(addressSchema.safeParse({ ...VALID_ADDRESS, additionalInfo: "" }).success).toBe(true);
    });

    test("accepts max 200 characters", () => {
      expect(addressSchema.safeParse({ ...VALID_ADDRESS, additionalInfo: "A".repeat(200) }).success).toBe(true);
    });

    test("rejects additionalInfo longer than 200 characters", () => {
      const result = addressSchema.safeParse({ ...VALID_ADDRESS, additionalInfo: "A".repeat(201) });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Informacje dodatkowe nie mogą przekraczać 200 znaków");
      }
    });
  });
});

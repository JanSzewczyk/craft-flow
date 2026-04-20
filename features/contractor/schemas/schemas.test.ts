import { brandingSchema } from "~/features/contractor/schemas/branding-schema";
import { companyDetailsSchema } from "~/features/contractor/schemas/company-details-schema";
import { emailSchema } from "~/features/contractor/schemas/email-schema";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VALID_COMPANY = { companyName: "Stolarnia u Jana", industry: "woodworking", phone: null };
const VALID_BRANDING = { logoUrl: "https://example.com/logo.png", brandColor: "#2563EB" };
const VALID_EMAIL = { emailSubject: "Temat", emailBody: "Treść wiadomości email" };

// ─── companyDetailsSchema ─────────────────────────────────────────────────────

describe("companyDetailsSchema", () => {
  describe("companyName", () => {
    test("rejects single character", () => {
      expect(companyDetailsSchema.safeParse({ ...VALID_COMPANY, companyName: "A" }).success).toBe(false);
    });

    test("accepts exactly 2 characters (min boundary)", () => {
      expect(companyDetailsSchema.safeParse({ ...VALID_COMPANY, companyName: "AB" }).success).toBe(true);
    });

    test("accepts normal company name", () => {
      expect(companyDetailsSchema.safeParse({ ...VALID_COMPANY, companyName: "Stolarnia u Jana" }).success).toBe(true);
    });
  });

  describe("industry", () => {
    test("rejects empty string", () => {
      expect(companyDetailsSchema.safeParse({ ...VALID_COMPANY, industry: "" }).success).toBe(false);
    });

    test("accepts non-empty value", () => {
      expect(companyDetailsSchema.safeParse({ ...VALID_COMPANY, industry: "woodworking" }).success).toBe(true);
    });
  });

  describe("phone", () => {
    test("accepts null", () => {
      expect(companyDetailsSchema.safeParse({ ...VALID_COMPANY, phone: null }).success).toBe(true);
    });

    test("rejects too-short number", () => {
      expect(companyDetailsSchema.safeParse({ ...VALID_COMPANY, phone: "123" }).success).toBe(false);
    });

    test("accepts Polish mobile format", () => {
      expect(companyDetailsSchema.safeParse({ ...VALID_COMPANY, phone: "+48 123 456 789" }).success).toBe(true);
    });

    test("accepts format without spaces", () => {
      expect(companyDetailsSchema.safeParse({ ...VALID_COMPANY, phone: "+48123456789" }).success).toBe(true);
    });

    test("accepts format with dashes", () => {
      expect(companyDetailsSchema.safeParse({ ...VALID_COMPANY, phone: "123-456-789" }).success).toBe(true);
    });
  });

  test("accepts a fully valid object", () => {
    expect(companyDetailsSchema.safeParse(VALID_COMPANY).success).toBe(true);
  });
});

// ─── brandingSchema ───────────────────────────────────────────────────────────

describe("brandingSchema", () => {
  describe("logoUrl", () => {
    test("rejects non-URL string", () => {
      expect(brandingSchema.safeParse({ ...VALID_BRANDING, logoUrl: "not-a-url" }).success).toBe(false);
    });

    test("rejects empty string", () => {
      expect(brandingSchema.safeParse({ ...VALID_BRANDING, logoUrl: "" }).success).toBe(false);
    });

    test("accepts https URL", () => {
      expect(brandingSchema.safeParse({ ...VALID_BRANDING, logoUrl: "https://example.com/logo.png" }).success).toBe(
        true
      );
    });
  });

  describe("brandColor", () => {
    test("accepts uppercase 6-digit hex", () => {
      expect(brandingSchema.safeParse({ ...VALID_BRANDING, brandColor: "#2563EB" }).success).toBe(true);
    });

    test("accepts lowercase 6-digit hex", () => {
      expect(brandingSchema.safeParse({ ...VALID_BRANDING, brandColor: "#2563eb" }).success).toBe(true);
    });

    test("rejects 3-digit hex", () => {
      expect(brandingSchema.safeParse({ ...VALID_BRANDING, brandColor: "#abc" }).success).toBe(false);
    });

    test("rejects hex without # prefix", () => {
      expect(brandingSchema.safeParse({ ...VALID_BRANDING, brandColor: "2563EB" }).success).toBe(false);
    });

    test("rejects invalid characters", () => {
      expect(brandingSchema.safeParse({ ...VALID_BRANDING, brandColor: "#ZZZZZZ" }).success).toBe(false);
    });
  });

  test("accepts a fully valid object", () => {
    expect(brandingSchema.safeParse(VALID_BRANDING).success).toBe(true);
  });
});

// ─── emailSchema ──────────────────────────────────────────────────────────────

describe("emailSchema", () => {
  describe("emailSubject", () => {
    test("rejects empty string", () => {
      expect(emailSchema.safeParse({ ...VALID_EMAIL, emailSubject: "" }).success).toBe(false);
    });

    test("accepts single character", () => {
      expect(emailSchema.safeParse({ ...VALID_EMAIL, emailSubject: "X" }).success).toBe(true);
    });
  });

  describe("emailBody", () => {
    test("rejects body shorter than 10 characters", () => {
      expect(emailSchema.safeParse({ ...VALID_EMAIL, emailBody: "Short" }).success).toBe(false);
    });

    test("rejects exactly 9 characters (below min)", () => {
      expect(emailSchema.safeParse({ ...VALID_EMAIL, emailBody: "123456789" }).success).toBe(false);
    });

    test("accepts exactly 10 characters (min boundary)", () => {
      expect(emailSchema.safeParse({ ...VALID_EMAIL, emailBody: "1234567890" }).success).toBe(true);
    });

    test("accepts body longer than 10 characters", () => {
      expect(emailSchema.safeParse({ ...VALID_EMAIL, emailBody: "Long enough body text" }).success).toBe(true);
    });
  });

  test("accepts a fully valid object", () => {
    expect(emailSchema.safeParse(VALID_EMAIL).success).toBe(true);
  });
});

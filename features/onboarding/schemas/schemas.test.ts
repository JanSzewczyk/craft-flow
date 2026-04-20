import { onboardingFormDataSchema } from "~/features/onboarding/schemas/onboarding-form-data-schema";
import { templateSchema, templateStepSchema } from "~/features/templates/schemas/template-schema";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VALID_COMPANY = { companyName: "Stolarnia u Jana", industry: "woodworking", phone: null };
const VALID_BRANDING = { logoUrl: "https://example.com/logo.png", brandColor: "#2563EB" };
const VALID_EMAIL = { emailSubject: "Temat", emailBody: "Treść wiadomości email" };
const VALID_TEMPLATE = {
  name: "Szablon",
  description: null,
  steps: [{ title: "Etap 1", description: null }]
};

// ─── templateStepSchema ───────────────────────────────────────────────────────

describe("templateStepSchema", () => {
  test("rejects empty title", () => {
    expect(templateStepSchema.safeParse({ title: "", description: null }).success).toBe(false);
  });

  test("accepts valid title with null description", () => {
    expect(templateStepSchema.safeParse({ title: "Step 1", description: null }).success).toBe(true);
  });

  test("accepts valid title with string description", () => {
    expect(templateStepSchema.safeParse({ title: "Step 1", description: "Details" }).success).toBe(true);
  });
});

// ─── templateSchema ───────────────────────────────────────────────────────────

describe("templateSchema", () => {
  test("rejects empty name", () => {
    expect(templateSchema.safeParse({ ...VALID_TEMPLATE, name: "" }).success).toBe(false);
  });

  test("rejects empty steps array", () => {
    expect(templateSchema.safeParse({ ...VALID_TEMPLATE, steps: [] }).success).toBe(false);
  });

  test("accepts null description", () => {
    expect(templateSchema.safeParse({ ...VALID_TEMPLATE, description: null }).success).toBe(true);
  });

  test("accepts multiple valid steps", () => {
    const steps = [
      { title: "Wycena", description: null },
      { title: "Realizacja", description: "Główna faza" }
    ];
    expect(templateSchema.safeParse({ ...VALID_TEMPLATE, steps }).success).toBe(true);
  });

  test("rejects step with empty title", () => {
    const steps = [{ title: "", description: null }];
    expect(templateSchema.safeParse({ ...VALID_TEMPLATE, steps }).success).toBe(false);
  });

  test("accepts a fully valid object", () => {
    expect(templateSchema.safeParse(VALID_TEMPLATE).success).toBe(true);
  });
});

// ─── onboardingFormDataSchema ─────────────────────────────────────────────────

describe("onboardingFormDataSchema", () => {
  const FULL_VALID = {
    companyDetails: VALID_COMPANY,
    branding: VALID_BRANDING,
    templateConfig: VALID_TEMPLATE,
    emailConfig: VALID_EMAIL
  };

  test("accepts fully valid object with all sections", () => {
    expect(onboardingFormDataSchema.safeParse(FULL_VALID).success).toBe(true);
  });

  test("accepts null branding (optional feature)", () => {
    expect(onboardingFormDataSchema.safeParse({ ...FULL_VALID, branding: null }).success).toBe(true);
  });

  test("accepts null emailConfig (optional feature)", () => {
    expect(onboardingFormDataSchema.safeParse({ ...FULL_VALID, emailConfig: null }).success).toBe(true);
  });

  test("accepts both branding and emailConfig as null (basic plan)", () => {
    expect(onboardingFormDataSchema.safeParse({ ...FULL_VALID, branding: null, emailConfig: null }).success).toBe(true);
  });

  test("rejects missing companyDetails", () => {
    const { companyDetails: _, ...rest } = FULL_VALID;
    expect(onboardingFormDataSchema.safeParse(rest).success).toBe(false);
  });

  test("rejects null companyDetails", () => {
    expect(onboardingFormDataSchema.safeParse({ ...FULL_VALID, companyDetails: null }).success).toBe(false);
  });

  test("rejects missing templateConfig", () => {
    const { templateConfig: _, ...rest } = FULL_VALID;
    expect(onboardingFormDataSchema.safeParse(rest).success).toBe(false);
  });

  test("rejects invalid companyName within companyDetails", () => {
    expect(
      onboardingFormDataSchema.safeParse({
        ...FULL_VALID,
        companyDetails: { ...VALID_COMPANY, companyName: "X" }
      }).success
    ).toBe(false);
  });
});

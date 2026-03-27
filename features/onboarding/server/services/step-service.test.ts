const mocks = vi.hoisted(() => ({
  detectClerkPlan: vi.fn(),
  getPlanById: vi.fn(),
  planHasBranding: vi.fn(),
  canUseWhitelabelEmails: vi.fn()
}));

vi.mock("~/features/billing/server", () => ({
  detectClerkPlan: mocks.detectClerkPlan,
  getPlanById: mocks.getPlanById,
  planHasBranding: mocks.planHasBranding,
  canUseWhitelabelEmails: mocks.canUseWhitelabelEmails
}));

import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { getOnboardingPlanConfig } from "~/features/onboarding/server/services/step-service";

// ─── Mock Plan Objects ────────────────────────────────────────────────────────

const BASIC_PLAN = { id: "basic", name: "Basic" };
const STANDARD_PLAN = { id: "standard", name: "Standard" };
const PREMIUM_PLAN = { id: "premium", name: "Premium" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setupBasicPlan() {
  mocks.detectClerkPlan.mockResolvedValue("basic");
  mocks.getPlanById.mockReturnValue(BASIC_PLAN);
  mocks.planHasBranding.mockReturnValue(false);
  mocks.canUseWhitelabelEmails.mockReturnValue(false);
}

function setupPremiumPlan() {
  mocks.detectClerkPlan.mockResolvedValue("premium");
  mocks.getPlanById.mockReturnValue(PREMIUM_PLAN);
  mocks.planHasBranding.mockReturnValue(true);
  mocks.canUseWhitelabelEmails.mockReturnValue(true);
}

function setupStandardPlan() {
  mocks.detectClerkPlan.mockResolvedValue("standard");
  mocks.getPlanById.mockReturnValue(STANDARD_PLAN);
  mocks.planHasBranding.mockReturnValue(true);
  mocks.canUseWhitelabelEmails.mockReturnValue(false);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("getOnboardingPlanConfig", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // ── Guard: no plan ──────────────────────────────────────────────────────────

  test("returns null when detectClerkPlan returns null", async () => {
    mocks.detectClerkPlan.mockResolvedValue(null);

    const result = await getOnboardingPlanConfig();

    expect(result).toBeNull();
  });

  test("returns null when getPlanById returns undefined", async () => {
    mocks.detectClerkPlan.mockResolvedValue("unknown");
    mocks.getPlanById.mockReturnValue(undefined);

    const result = await getOnboardingPlanConfig();

    expect(result).toBeNull();
  });

  // ── Base config (no currentStep) ────────────────────────────────────────────

  describe("base config without currentStep", () => {
    test("basic plan: 3 active steps (no branding, no email)", async () => {
      setupBasicPlan();

      const result = await getOnboardingPlanConfig();

      expect(result).not.toBeNull();
      expect(result!.steps).toHaveLength(3);
      expect(result!.steps.map((s) => s.step)).toEqual([
        OnboardingStep.COMPANY_DETAILS,
        OnboardingStep.TEMPLATE,
        OnboardingStep.SUMMARY
      ]);
    });

    test("basic plan: firstStep = COMPANY_DETAILS, lastStep = SUMMARY", async () => {
      setupBasicPlan();

      const result = await getOnboardingPlanConfig();

      expect(result!.firstStep).toBe(OnboardingStep.COMPANY_DETAILS);
      expect(result!.lastStep).toBe(OnboardingStep.SUMMARY);
    });

    test("premium plan: 5 active steps (branding + email included)", async () => {
      setupPremiumPlan();

      const result = await getOnboardingPlanConfig();

      expect(result!.steps).toHaveLength(5);
      expect(result!.steps.map((s) => s.step)).toEqual([
        OnboardingStep.COMPANY_DETAILS,
        OnboardingStep.BRANDING,
        OnboardingStep.TEMPLATE,
        OnboardingStep.EMAIL,
        OnboardingStep.SUMMARY
      ]);
    });

    test("standard plan: 4 active steps (branding only, no email)", async () => {
      setupStandardPlan();

      const result = await getOnboardingPlanConfig();

      expect(result!.steps).toHaveLength(4);
      expect(result!.steps.map((s) => s.step)).toEqual([
        OnboardingStep.COMPANY_DETAILS,
        OnboardingStep.BRANDING,
        OnboardingStep.TEMPLATE,
        OnboardingStep.SUMMARY
      ]);
    });

    test("isStepActive returns false for BRANDING on basic plan", async () => {
      setupBasicPlan();

      const result = await getOnboardingPlanConfig();

      expect(result!.isStepActive(OnboardingStep.BRANDING)).toBe(false);
    });

    test("isStepActive returns true for BRANDING on premium plan", async () => {
      setupPremiumPlan();

      const result = await getOnboardingPlanConfig();

      expect(result!.isStepActive(OnboardingStep.BRANDING)).toBe(true);
    });

    test("isStepActive returns false for EMAIL on basic plan", async () => {
      setupBasicPlan();

      const result = await getOnboardingPlanConfig();

      expect(result!.isStepActive(OnboardingStep.EMAIL)).toBe(false);
    });

    test("includes correct step labels", async () => {
      setupBasicPlan();

      const result = await getOnboardingPlanConfig();

      const labels = result!.steps.map((s) => s.label);
      expect(labels).toContain("Firma");
      expect(labels).toContain("Podsumowanie");
    });
  });

  // ── Navigation with currentStep ─────────────────────────────────────────────

  describe("step navigation — basic plan", () => {
    test("COMPANY_DETAILS: first step, previousStep=null, nextStep=TEMPLATE", async () => {
      setupBasicPlan();

      const result = await getOnboardingPlanConfig(OnboardingStep.COMPANY_DETAILS);

      expect(result).not.toBeNull();
      expect(result!.currentStep).toBe(OnboardingStep.COMPANY_DETAILS);
      expect(result!.previousStep).toBeNull();
      expect(result!.nextStep).toBe(OnboardingStep.TEMPLATE);
      expect(result!.wasRedirected).toBe(false);
    });

    test("TEMPLATE: middle step, previousStep=COMPANY_DETAILS, nextStep=SUMMARY", async () => {
      setupBasicPlan();

      const result = await getOnboardingPlanConfig(OnboardingStep.TEMPLATE);

      expect(result!.currentStep).toBe(OnboardingStep.TEMPLATE);
      expect(result!.previousStep).toBe(OnboardingStep.COMPANY_DETAILS);
      expect(result!.nextStep).toBe(OnboardingStep.SUMMARY);
      expect(result!.wasRedirected).toBe(false);
    });

    test("SUMMARY: last step, previousStep=TEMPLATE, nextStep=null", async () => {
      setupBasicPlan();

      const result = await getOnboardingPlanConfig(OnboardingStep.SUMMARY);

      expect(result!.currentStep).toBe(OnboardingStep.SUMMARY);
      expect(result!.previousStep).toBe(OnboardingStep.TEMPLATE);
      expect(result!.nextStep).toBeNull();
      expect(result!.wasRedirected).toBe(false);
    });
  });

  describe("step navigation — premium plan", () => {
    test("COMPANY_DETAILS: nextStep=BRANDING (branding active for premium)", async () => {
      setupPremiumPlan();

      const result = await getOnboardingPlanConfig(OnboardingStep.COMPANY_DETAILS);

      expect(result!.nextStep).toBe(OnboardingStep.BRANDING);
      expect(result!.previousStep).toBeNull();
    });

    test("BRANDING: active, previousStep=COMPANY_DETAILS, nextStep=TEMPLATE", async () => {
      setupPremiumPlan();

      const result = await getOnboardingPlanConfig(OnboardingStep.BRANDING);

      expect(result!.currentStep).toBe(OnboardingStep.BRANDING);
      expect(result!.previousStep).toBe(OnboardingStep.COMPANY_DETAILS);
      expect(result!.nextStep).toBe(OnboardingStep.TEMPLATE);
      expect(result!.wasRedirected).toBe(false);
    });

    test("EMAIL: active, previousStep=TEMPLATE, nextStep=SUMMARY", async () => {
      setupPremiumPlan();

      const result = await getOnboardingPlanConfig(OnboardingStep.EMAIL);

      expect(result!.currentStep).toBe(OnboardingStep.EMAIL);
      expect(result!.previousStep).toBe(OnboardingStep.TEMPLATE);
      expect(result!.nextStep).toBe(OnboardingStep.SUMMARY);
      expect(result!.wasRedirected).toBe(false);
    });
  });

  describe("inactive step redirect — basic plan", () => {
    test("BRANDING (inactive) → redirected to COMPANY_DETAILS (closest preceding active)", async () => {
      setupBasicPlan();

      const result = await getOnboardingPlanConfig(OnboardingStep.BRANDING);

      expect(result!.wasRedirected).toBe(true);
      expect(result!.currentStep).toBe(OnboardingStep.COMPANY_DETAILS);
    });

    test("EMAIL (inactive) → redirected to TEMPLATE (closest preceding active)", async () => {
      setupBasicPlan();

      const result = await getOnboardingPlanConfig(OnboardingStep.EMAIL);

      expect(result!.wasRedirected).toBe(true);
      expect(result!.currentStep).toBe(OnboardingStep.TEMPLATE);
    });
  });
});

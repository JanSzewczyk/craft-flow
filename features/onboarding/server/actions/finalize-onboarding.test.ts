const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  redirect: vi.fn(),
  getOnboardingPlanConfig: vi.fn(),
  getCachedOnboardingState: vi.fn(),
  markOnboardingComplete: vi.fn(),
  upsertContractorProfile: vi.fn(),
  upsertEmailTemplate: vi.fn(),
  createTemplateWithSteps: vi.fn(),
  setUserMetadata: vi.fn()
}));

vi.mock("server-only", () => ({}));
vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("~/features/onboarding/server", () => ({ getOnboardingPlanConfig: mocks.getOnboardingPlanConfig }));
vi.mock("~/features/onboarding/server/db", () => ({
  getCachedOnboardingState: mocks.getCachedOnboardingState,
  markOnboardingComplete: mocks.markOnboardingComplete
}));
vi.mock("~/features/contractor/server/db", () => ({
  upsertContractorProfile: mocks.upsertContractorProfile,
  upsertEmailTemplate: mocks.upsertEmailTemplate,
  EmailTemplateType: { WELCOME: "welcome" }
}));
vi.mock("~/features/templates/server/db", () => ({ createTemplateWithSteps: mocks.createTemplateWithSteps }));
vi.mock("~/features/auth/server/api/set-user-metadata", () => ({ setUserMetadata: mocks.setUserMetadata }));
vi.mock("~/features/auth/constants/roles", () => ({ Role: { CONTRACTOR: "CONTRACTOR" } }));
vi.mock("~/lib/logger", () => {
  const noop = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), child: vi.fn() };
  noop.child.mockReturnValue(noop);
  return { default: noop, createLogger: vi.fn(() => noop) };
});

import { finalizeOnboardingAction } from "~/features/onboarding/server/actions/finalize-onboarding";
import { onboardingStateBuilder } from "~/features/onboarding/test/builders";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const validState = onboardingStateBuilder.one({
  traits: "withAllData",
  overrides: { currentStep: "/onboarding/summary" }
});

const premiumConfig = {
  plan: { id: "premium", name: "Premium" },
  features: { branding: true, whitelabelEmails: true }
};

const basicConfig = {
  plan: { id: "basic", name: "Basic" },
  features: { branding: false, whitelabelEmails: false }
};

const dbError = { code: "unknown", message: "DB error" };

// ─── Default happy-path setup ─────────────────────────────────────────────────

function setupHappyPath(config = premiumConfig, state = validState) {
  mocks.auth.mockResolvedValue({ userId: "user-123", isAuthenticated: true });
  mocks.getOnboardingPlanConfig.mockResolvedValue(config);
  mocks.getCachedOnboardingState.mockResolvedValue([null, state]);
  mocks.upsertContractorProfile.mockResolvedValue([null, {}]);
  mocks.upsertEmailTemplate.mockResolvedValue([null, {}]);
  mocks.createTemplateWithSteps.mockResolvedValue([null, {}]);
  mocks.markOnboardingComplete.mockResolvedValue([null, {}]);
  mocks.setUserMetadata.mockResolvedValue([null, {}]);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("finalizeOnboardingAction", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // ── Auth guard ──────────────────────────────────────────────────────────────

  test("returns error when unauthenticated", async () => {
    mocks.auth.mockResolvedValue({ userId: null, isAuthenticated: false });

    const result = await finalizeOnboardingAction();

    expect(result).toEqual({ success: false, error: "Nie jesteś zalogowany" });
    expect(mocks.getOnboardingPlanConfig).not.toHaveBeenCalled();
  });

  // ── Plan check ──────────────────────────────────────────────────────────────

  test("returns error when no active plan", async () => {
    mocks.auth.mockResolvedValue({ userId: "user-123", isAuthenticated: true });
    mocks.getOnboardingPlanConfig.mockResolvedValue(null);

    const result = await finalizeOnboardingAction();

    expect(result).toEqual({ success: false, error: "Nie znaleziono aktywnego planu" });
    expect(mocks.getCachedOnboardingState).not.toHaveBeenCalled();
  });

  // ── State fetch ─────────────────────────────────────────────────────────────

  test("returns error when getCachedOnboardingState fails", async () => {
    mocks.auth.mockResolvedValue({ userId: "user-123", isAuthenticated: true });
    mocks.getOnboardingPlanConfig.mockResolvedValue(premiumConfig);
    mocks.getCachedOnboardingState.mockResolvedValue([dbError, null]);

    const result = await finalizeOnboardingAction();

    expect(result).toEqual({ success: false, error: "Nie znaleziono stanu onboardingu" });
    expect(mocks.upsertContractorProfile).not.toHaveBeenCalled();
  });

  // ── Schema validation ───────────────────────────────────────────────────────

  test("returns error when state fails schema validation (companyDetails missing)", async () => {
    mocks.auth.mockResolvedValue({ userId: "user-123", isAuthenticated: true });
    mocks.getOnboardingPlanConfig.mockResolvedValue(premiumConfig);
    mocks.getCachedOnboardingState.mockResolvedValue([null, { ...validState, companyDetails: null }]);

    const result = await finalizeOnboardingAction();

    expect(result).toEqual({ success: false, error: "Niekompletne dane onboardingu" });
    expect(mocks.upsertContractorProfile).not.toHaveBeenCalled();
  });

  test("returns error when state fails schema validation (templateConfig missing)", async () => {
    mocks.auth.mockResolvedValue({ userId: "user-123", isAuthenticated: true });
    mocks.getOnboardingPlanConfig.mockResolvedValue(premiumConfig);
    mocks.getCachedOnboardingState.mockResolvedValue([null, { ...validState, templateConfig: null }]);

    const result = await finalizeOnboardingAction();

    expect(result).toEqual({ success: false, error: "Niekompletne dane onboardingu" });
  });

  // ── Contractor profile ──────────────────────────────────────────────────────

  test("returns error when upsertContractorProfile fails", async () => {
    setupHappyPath();
    mocks.upsertContractorProfile.mockResolvedValue([dbError, null]);

    const result = await finalizeOnboardingAction();

    expect(result).toEqual({ success: false, error: "Nie udało się zapisać profilu firmy" });
    expect(mocks.upsertEmailTemplate).not.toHaveBeenCalled();
  });

  // ── Email template (premium) ────────────────────────────────────────────────

  test("returns error when upsertEmailTemplate fails (premium plan)", async () => {
    setupHappyPath(premiumConfig);
    mocks.upsertEmailTemplate.mockResolvedValue([dbError, null]);

    const result = await finalizeOnboardingAction();

    expect(result).toEqual({ success: false, error: "Nie udało się zapisać szablonu e-mail" });
    expect(mocks.createTemplateWithSteps).not.toHaveBeenCalled();
  });

  test("does NOT call upsertEmailTemplate for basic plan (no whitelabel emails)", async () => {
    setupHappyPath(basicConfig);

    await finalizeOnboardingAction();

    expect(mocks.upsertEmailTemplate).not.toHaveBeenCalled();
    expect(mocks.redirect).toHaveBeenCalledWith("/onboarding/success");
  });

  // ── Template creation ───────────────────────────────────────────────────────

  test("returns error when createTemplateWithSteps fails", async () => {
    setupHappyPath();
    mocks.createTemplateWithSteps.mockResolvedValue([dbError, null]);

    const result = await finalizeOnboardingAction();

    expect(result).toEqual({ success: false, error: "Nie udało się zapisać szablonu" });
    expect(mocks.markOnboardingComplete).not.toHaveBeenCalled();
  });

  // ── Mark complete ───────────────────────────────────────────────────────────

  test("returns error when markOnboardingComplete fails", async () => {
    setupHappyPath();
    mocks.markOnboardingComplete.mockResolvedValue([dbError, null]);

    const result = await finalizeOnboardingAction();

    expect(result).toEqual({ success: false, error: "Nie udało się zakończyć onboardingu" });
  });

  // ── User metadata ───────────────────────────────────────────────────────────

  test("returns error when setUserMetadata fails", async () => {
    setupHappyPath();
    mocks.setUserMetadata.mockResolvedValue([dbError, null]);

    const result = await finalizeOnboardingAction();

    expect(result).toEqual({ success: false, error: "Nie udało się zaktualizować profilu" });
  });

  // ── Happy paths ─────────────────────────────────────────────────────────────

  test("premium plan: calls all services and redirects to /onboarding/success", async () => {
    setupHappyPath(premiumConfig);

    await finalizeOnboardingAction();

    expect(mocks.upsertContractorProfile).toHaveBeenCalledOnce();
    expect(mocks.upsertEmailTemplate).toHaveBeenCalledOnce();
    expect(mocks.createTemplateWithSteps).toHaveBeenCalledOnce();
    expect(mocks.markOnboardingComplete).toHaveBeenCalledOnce();
    expect(mocks.setUserMetadata).toHaveBeenCalledOnce();
    expect(mocks.redirect).toHaveBeenCalledWith("/onboarding/success");
  });

  test("premium plan: merges branding into contractor profile", async () => {
    setupHappyPath(premiumConfig);

    await finalizeOnboardingAction();

    expect(mocks.upsertContractorProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        contractorId: "user-123",
        data: expect.objectContaining({
          companyName: validState.companyDetails!.companyName,
          brandColor: validState.branding!.brandColor,
          logoUrl: validState.branding!.logoUrl
        })
      })
    );
  });

  test("basic plan: does NOT merge branding into contractor profile", async () => {
    setupHappyPath(basicConfig);

    await finalizeOnboardingAction();

    const callArgs = mocks.upsertContractorProfile.mock.calls[0]?.[0]?.data;
    expect(callArgs).not.toHaveProperty("brandColor");
    expect(callArgs).not.toHaveProperty("logoUrl");
    expect(callArgs).toHaveProperty("companyName", validState.companyDetails!.companyName);
  });

  test("calls setUserMetadata with CONTRACTOR role and onboardingComplete=true", async () => {
    setupHappyPath(premiumConfig);

    await finalizeOnboardingAction();

    expect(mocks.setUserMetadata).toHaveBeenCalledWith("user-123", {
      roles: ["CONTRACTOR"],
      onboardingComplete: true
    });
  });

  test("createTemplateWithSteps receives correct template data", async () => {
    setupHappyPath(premiumConfig);

    await finalizeOnboardingAction();

    expect(mocks.createTemplateWithSteps).toHaveBeenCalledWith(
      expect.objectContaining({
        contractorId: "user-123",
        templateData: expect.objectContaining({
          name: validState.templateConfig!.name,
          description: validState.templateConfig!.description,
          steps: validState.templateConfig!.steps
        })
      })
    );
  });
});

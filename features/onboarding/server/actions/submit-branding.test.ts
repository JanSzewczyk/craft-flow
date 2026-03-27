const mocks = vi.hoisted(() => ({
  redirect: vi.fn(),
  getOnboardingPlanConfig: vi.fn(),
  updateStepData: vi.fn()
}));

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("~/features/onboarding/server/services/step-service", () => ({
  getOnboardingPlanConfig: mocks.getOnboardingPlanConfig
}));
vi.mock("~/features/onboarding/server/db", () => ({
  updateStepData: mocks.updateStepData
}));
vi.mock("~/lib/logger", () => {
  const noop = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), child: vi.fn() };
  noop.child.mockReturnValue(noop);
  return { default: noop, createLogger: vi.fn(() => noop) };
});

import { submitBrandingAction } from "~/features/onboarding/server/actions/submit-branding";
import { brandingFormBuilder, onboardingStateBuilder } from "~/features/onboarding/test/builders";

const mockState = onboardingStateBuilder.one({ overrides: { currentStep: "/onboarding/branding" } });
const mockConfig = { nextStep: "/onboarding/template" };
const dbError = { code: "unknown", message: "DB error" };
const brandingData = brandingFormBuilder.one();

describe("submitBrandingAction", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.getOnboardingPlanConfig.mockResolvedValue(mockConfig);
    mocks.updateStepData.mockResolvedValue([null, {}]);
  });

  test("returns error when no active plan found", async () => {
    mocks.getOnboardingPlanConfig.mockResolvedValue(null);

    const result = await submitBrandingAction(brandingData, mockState);

    expect(result).toEqual({ success: false, error: "Nie znaleziono aktywnego planu" });
    expect(mocks.updateStepData).not.toHaveBeenCalled();
  });

  test("returns error when updateStepData fails", async () => {
    mocks.updateStepData.mockResolvedValue([dbError, null]);

    const result = await submitBrandingAction(brandingData, mockState);

    expect(result).toEqual({ success: false, error: "Nie udało się zapisać danych brandingu" });
  });

  test("redirects to next step on success", async () => {
    await submitBrandingAction(brandingData, mockState);

    expect(mocks.updateStepData).toHaveBeenCalledWith(
      mockState.contractorId,
      expect.objectContaining({ branding: brandingData })
    );
    expect(mocks.redirect).toHaveBeenCalledWith(mockConfig.nextStep);
  });
});

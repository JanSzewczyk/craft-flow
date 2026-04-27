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

import { submitCompanyDetailsAction } from "~/features/onboarding/server/actions/submit-company-details";
import { companyDetailsFormBuilder, onboardingStateBuilder } from "~/features/onboarding/test/builders";

const mockState = onboardingStateBuilder.one({ overrides: { currentStep: "/onboarding/company-details" } });
const mockConfig = { nextStep: "/onboarding/template" };
const dbError = { code: "unknown", message: "DB error" };
const companyData = companyDetailsFormBuilder.one();

describe("submitCompanyDetailsAction", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.getOnboardingPlanConfig.mockResolvedValue(mockConfig);
    mocks.updateStepData.mockResolvedValue([null, {}]);
  });

  test("returns error when no active plan found", async () => {
    mocks.getOnboardingPlanConfig.mockResolvedValue(null);

    const result = await submitCompanyDetailsAction(companyData, mockState);

    expect(result).toEqual({ success: false, error: "Nie znaleziono aktywnego planu" });
    expect(mocks.updateStepData).not.toHaveBeenCalled();
  });

  test("returns error when updateStepData fails", async () => {
    mocks.updateStepData.mockResolvedValue([dbError, null]);

    const result = await submitCompanyDetailsAction(companyData, mockState);

    expect(result).toEqual({ success: false, error: "Nie udało się zapisać danych firmy" });
  });

  test("redirects to next step on success", async () => {
    await submitCompanyDetailsAction(companyData, mockState);

    expect(mocks.updateStepData).toHaveBeenCalledWith(
      expect.objectContaining({
        contractorId: mockState.contractorId,
        stepData: expect.objectContaining({ companyDetails: companyData })
      })
    );
    expect(mocks.redirect).toHaveBeenCalledWith(mockConfig.nextStep);
  });
});

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

import { submitTemplateAction } from "~/features/onboarding/server/actions/submit-template";
import { onboardingStateBuilder } from "~/features/onboarding/test/builders";
import { templateFormBuilder } from "~/features/templates/test/builders";

const mockState = onboardingStateBuilder.one({ overrides: { currentStep: "/onboarding/template" } });
const mockConfig = { nextStep: "/onboarding/email" };
const dbError = { code: "unknown", message: "DB error" };
const templateData = templateFormBuilder.one();

describe("submitTemplateAction", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.getOnboardingPlanConfig.mockResolvedValue(mockConfig);
    mocks.updateStepData.mockResolvedValue([null, {}]);
  });

  test("returns error when no active plan found", async () => {
    mocks.getOnboardingPlanConfig.mockResolvedValue(null);

    const result = await submitTemplateAction(templateData, mockState);

    expect(result).toEqual({ success: false, error: "Nie znaleziono aktywnego planu" });
    expect(mocks.updateStepData).not.toHaveBeenCalled();
  });

  test("returns error when updateStepData fails", async () => {
    mocks.updateStepData.mockResolvedValue([dbError, null]);

    const result = await submitTemplateAction(templateData, mockState);

    expect(result).toEqual({ success: false, error: "Nie udało się zapisać konfiguracji szablonu" });
  });

  test("redirects to next step on success", async () => {
    await submitTemplateAction(templateData, mockState);

    expect(mocks.updateStepData).toHaveBeenCalledWith(
      mockState.contractorId,
      expect.objectContaining({ templateConfig: templateData })
    );
    expect(mocks.redirect).toHaveBeenCalledWith(mockConfig.nextStep);
  });
});

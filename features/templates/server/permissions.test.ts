const mocks = vi.hoisted(() => ({
  getTemplateCountByContractor: vi.fn(),
  getPlanFeatures: vi.fn()
}));

vi.mock("~/features/templates/server/db/queries", () => ({
  getTemplateCountByContractor: mocks.getTemplateCountByContractor
}));
vi.mock("~/features/billing/server", () => ({
  getPlanFeatures: mocks.getPlanFeatures
}));

import { SupabaseServiceError } from "~/lib/supabase/errors";

import { canAddTemplate } from "./permissions";

function buildCapabilities(templateLimit: number | null) {
  return {
    features: { branding: false, whitelabelEmails: false },
    limitations: {
      templates: templateLimit,
      projectsPerMonth: null,
      photosPerProject: null,
      photoResolution: "standard" as const,
      supportResponseHours: null
    }
  };
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("canAddTemplate", () => {
  test("returns error when count query fails", async () => {
    mocks.getTemplateCountByContractor.mockResolvedValue([SupabaseServiceError.unknown(), null]);
    const [error, data] = await canAddTemplate("user-1");
    expect(error).not.toBeNull();
    expect(data).toBeNull();
  });

  test("returns success when limit is null (premium plan)", async () => {
    mocks.getTemplateCountByContractor.mockResolvedValue([null, 100]);
    mocks.getPlanFeatures.mockResolvedValue(buildCapabilities(null));
    const [error, data] = await canAddTemplate("user-1");
    expect(error).toBeNull();
    expect(data).toBeUndefined();
  });

  test("returns success when count is below limit (basic plan)", async () => {
    mocks.getTemplateCountByContractor.mockResolvedValue([null, 1]);
    mocks.getPlanFeatures.mockResolvedValue(buildCapabilities(2));
    const [error, data] = await canAddTemplate("user-1");
    expect(error).toBeNull();
    expect(data).toBeUndefined();
  });

  test("returns limit_exceeded error when count equals limit", async () => {
    mocks.getTemplateCountByContractor.mockResolvedValue([null, 2]);
    mocks.getPlanFeatures.mockResolvedValue(buildCapabilities(2));
    const [error] = await canAddTemplate("user-1");
    expect(error).not.toBeNull();
    expect(error?.code).toBe("limit_exceeded");
  });

  test("returns limit_exceeded error when count exceeds limit", async () => {
    mocks.getTemplateCountByContractor.mockResolvedValue([null, 5]);
    mocks.getPlanFeatures.mockResolvedValue(buildCapabilities(2));
    const [error] = await canAddTemplate("user-1");
    expect(error).not.toBeNull();
    expect(error?.code).toBe("limit_exceeded");
  });

  test("returns success when no plan (defaults to basic, count below limit)", async () => {
    mocks.getTemplateCountByContractor.mockResolvedValue([null, 1]);
    mocks.getPlanFeatures.mockResolvedValue(buildCapabilities(2));
    const [error] = await canAddTemplate("user-1");
    expect(error).toBeNull();
  });

  test("calls getTemplateCountByContractor with correct contractorId", async () => {
    mocks.getTemplateCountByContractor.mockResolvedValue([null, 0]);
    mocks.getPlanFeatures.mockResolvedValue(buildCapabilities(10));
    await canAddTemplate("contractor-abc");
    expect(mocks.getTemplateCountByContractor).toHaveBeenCalledWith({ contractorId: "contractor-abc" });
  });
});

const mocks = vi.hoisted(() => ({
  getTemplateCountByContractor: vi.fn(),
  detectClerkPlan: vi.fn()
}));

vi.mock("server-only", () => ({}));
vi.mock("~/features/templates/server/db/queries", () => ({
  getTemplateCountByContractor: mocks.getTemplateCountByContractor
}));
vi.mock("~/features/billing/server", () => ({
  detectClerkPlan: mocks.detectClerkPlan,
  getTemplateLimit: (planId: string) => {
    if (planId === "basic") return 2;
    if (planId === "standard") return 10;
    if (planId === "premium") return null;
    return null;
  }
}));

import { SupabaseServiceError } from "~/lib/supabase/errors";

import { canAddTemplate } from "./permissions";

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
    mocks.detectClerkPlan.mockResolvedValue("premium");
    const [error, data] = await canAddTemplate("user-1");
    expect(error).toBeNull();
    expect(data).toBeUndefined();
  });

  test("returns success when count is below limit (basic plan)", async () => {
    mocks.getTemplateCountByContractor.mockResolvedValue([null, 1]);
    mocks.detectClerkPlan.mockResolvedValue("basic");
    const [error, data] = await canAddTemplate("user-1");
    expect(error).toBeNull();
    expect(data).toBeUndefined();
  });

  test("returns limit_exceeded error when count equals limit", async () => {
    mocks.getTemplateCountByContractor.mockResolvedValue([null, 2]);
    mocks.detectClerkPlan.mockResolvedValue("basic");
    const [error] = await canAddTemplate("user-1");
    expect(error).not.toBeNull();
    expect(error?.code).toBe("limit_exceeded");
  });

  test("returns limit_exceeded error when count exceeds limit", async () => {
    mocks.getTemplateCountByContractor.mockResolvedValue([null, 5]);
    mocks.detectClerkPlan.mockResolvedValue("basic");
    const [error] = await canAddTemplate("user-1");
    expect(error).not.toBeNull();
    expect(error?.code).toBe("limit_exceeded");
  });

  test("defaults to basic plan when detectClerkPlan returns null", async () => {
    mocks.getTemplateCountByContractor.mockResolvedValue([null, 1]);
    mocks.detectClerkPlan.mockResolvedValue(null);
    const [error] = await canAddTemplate("user-1");
    expect(error).toBeNull();
  });

  test("calls getTemplateCountByContractor with correct contractorId", async () => {
    mocks.getTemplateCountByContractor.mockResolvedValue([null, 0]);
    mocks.detectClerkPlan.mockResolvedValue("standard");
    await canAddTemplate("contractor-abc");
    expect(mocks.getTemplateCountByContractor).toHaveBeenCalledWith("contractor-abc");
  });
});

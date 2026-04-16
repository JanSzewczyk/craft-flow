const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  revalidatePath: vi.fn(),
  createTemplate: vi.fn(),
  updateTemplate: vi.fn(),
  deleteTemplate: vi.fn(),
  duplicateTemplate: vi.fn()
}));

vi.mock("server-only", () => ({}));
vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("~/features/templates/server/services/templates.service", () => ({
  createTemplate: mocks.createTemplate,
  updateTemplate: mocks.updateTemplate,
  deleteTemplate: mocks.deleteTemplate,
  duplicateTemplate: mocks.duplicateTemplate
}));
vi.mock("~/lib/logger", () => {
  const noop = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), child: vi.fn() };
  noop.child.mockReturnValue(noop);
  return { default: noop, createLogger: vi.fn(() => noop) };
});

import { templateFormBuilder } from "~/features/templates/test/builders";
import { SupabaseServiceError } from "~/lib/supabase/errors";

import { createTemplateAction } from "./create-template.action";
import { deleteTemplateAction } from "./delete-template.action";
import { duplicateTemplateAction } from "./duplicate-template.action";
import { updateTemplateAction } from "./update-template.action";

const AUTHENTICATED = { isAuthenticated: true, userId: "user-1" };
const UNAUTHENTICATED = { isAuthenticated: false, userId: null };

const templateData = templateFormBuilder.one();
const mockTemplate = {
  id: "tpl-1",
  contractorId: "user-1",
  name: templateData.name,
  description: templateData.description ?? null,
  createdAt: new Date(),
  updatedAt: new Date()
};

beforeEach(() => {
  vi.resetAllMocks();
  mocks.auth.mockResolvedValue(AUTHENTICATED);
});

// ─── createTemplateAction ────────────────────────────────────────────────────

describe("createTemplateAction", () => {
  test("returns error when unauthenticated", async () => {
    mocks.auth.mockResolvedValue(UNAUTHENTICATED);
    const result = await createTemplateAction(templateData);
    expect(result).toEqual({ success: false, error: "Nie jesteś zalogowany" });
    expect(mocks.createTemplate).not.toHaveBeenCalled();
  });

  test("returns error when service fails with limit_exceeded", async () => {
    mocks.createTemplate.mockResolvedValue([SupabaseServiceError.limitExceeded(5), null]);
    const result = await createTemplateAction(templateData);
    expect(result).toEqual({
      success: false,
      error: "Osiągnięto limit 5 szablonów. Zwiększ plan, aby dodać więcej."
    });
  });

  test("returns error when service fails with unknown error", async () => {
    mocks.createTemplate.mockResolvedValue([SupabaseServiceError.unknown(), null]);
    const result = await createTemplateAction(templateData);
    expect(result).toEqual({ success: false, error: "Wystąpił błąd serwera. Spróbuj ponownie." });
  });

  test("revalidates path and returns success on success", async () => {
    mocks.createTemplate.mockResolvedValue([null, mockTemplate]);
    const result = await createTemplateAction(templateData);
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/app/templates");
    expect(result).toEqual({ success: true, data: mockTemplate, message: "Szablon został utworzony" });
  });

  test("calls service with correct userId and data", async () => {
    mocks.createTemplate.mockResolvedValue([null, mockTemplate]);
    await createTemplateAction(templateData);
    expect(mocks.createTemplate).toHaveBeenCalledWith("user-1", templateData);
  });
});

// ─── updateTemplateAction ────────────────────────────────────────────────────

describe("updateTemplateAction", () => {
  test("returns error when unauthenticated", async () => {
    mocks.auth.mockResolvedValue(UNAUTHENTICATED);
    const result = await updateTemplateAction("tpl-1", templateData);
    expect(result).toEqual({ success: false, error: "Nie jesteś zalogowany" });
  });

  test("returns error when template not found", async () => {
    mocks.updateTemplate.mockResolvedValue([SupabaseServiceError.notFound("Template"), null]);
    const result = await updateTemplateAction("tpl-1", templateData);
    expect(result).toEqual({ success: false, error: "Szablon nie istnieje" });
  });

  test("returns error when permission denied", async () => {
    mocks.updateTemplate.mockResolvedValue([SupabaseServiceError.unauthorized(), null]);
    const result = await updateTemplateAction("tpl-1", templateData);
    expect(result).toEqual({ success: false, error: "Brak uprawnień" });
  });

  test("revalidates path and returns success on success", async () => {
    mocks.updateTemplate.mockResolvedValue([null, mockTemplate]);
    const result = await updateTemplateAction("tpl-1", templateData);
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/app/templates");
    expect(result).toEqual({ success: true, data: mockTemplate, message: "Szablon został zapisany" });
  });
});

// ─── deleteTemplateAction ────────────────────────────────────────────────────

describe("deleteTemplateAction", () => {
  test("returns error when unauthenticated", async () => {
    mocks.auth.mockResolvedValue(UNAUTHENTICATED);
    const result = await deleteTemplateAction("tpl-1");
    expect(result).toEqual({ success: false, error: "Nie jesteś zalogowany" });
  });

  test("returns error when permission denied", async () => {
    mocks.deleteTemplate.mockResolvedValue([SupabaseServiceError.unauthorized(), null]);
    const result = await deleteTemplateAction("tpl-1");
    expect(result).toEqual({ success: false, error: "Brak uprawnień" });
  });

  test("revalidates path and returns success on success", async () => {
    mocks.deleteTemplate.mockResolvedValue([null, { id: "tpl-1" }]);
    const result = await deleteTemplateAction("tpl-1");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/app/templates");
    expect(result).toEqual({ success: true, data: { id: "tpl-1" }, message: "Szablon został usunięty" });
  });
});

// ─── duplicateTemplateAction ─────────────────────────────────────────────────

describe("duplicateTemplateAction", () => {
  test("returns error when unauthenticated", async () => {
    mocks.auth.mockResolvedValue(UNAUTHENTICATED);
    const result = await duplicateTemplateAction("tpl-1");
    expect(result).toEqual({ success: false, error: "Nie jesteś zalogowany" });
  });

  test("returns error when limit exceeded", async () => {
    mocks.duplicateTemplate.mockResolvedValue([SupabaseServiceError.limitExceeded(3), null]);
    const result = await duplicateTemplateAction("tpl-1");
    expect(result).toEqual({
      success: false,
      error: "Osiągnięto limit 3 szablonów. Zwiększ plan, aby dodać więcej."
    });
  });

  test("revalidates path and returns success with template name", async () => {
    mocks.duplicateTemplate.mockResolvedValue([null, mockTemplate]);
    const result = await duplicateTemplateAction("tpl-1");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/app/templates");
    expect(result).toEqual({
      success: true,
      data: mockTemplate,
      message: `Szablon "${mockTemplate.name}" został utworzony`
    });
  });
});

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  deleteFile: vi.fn(),
  getPathFromPublicUrl: vi.fn()
}));

vi.mock("server-only", () => ({}));
vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }));
vi.mock("~/lib/supabase/storage", () => ({
  deleteFile: mocks.deleteFile,
  getPathFromPublicUrl: mocks.getPathFromPublicUrl
}));
vi.mock("~/lib/logger", () => {
  const noop = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), child: vi.fn() };
  noop.child.mockReturnValue(noop);
  return { default: noop, createLogger: vi.fn(() => noop) };
});

import { deleteLogo } from "~/features/onboarding/server/actions/delete-logo";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const LOGO_URL = "https://project.supabase.co/storage/v1/object/public/logos/user-123/logo.png";
const FILE_PATH = "user-123/logo.png";

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("deleteLogo", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.auth.mockResolvedValue({ userId: "user-123", isAuthenticated: true });
    mocks.getPathFromPublicUrl.mockReturnValue(FILE_PATH);
    mocks.deleteFile.mockResolvedValue([null, undefined]);
  });

  test("returns error when unauthenticated", async () => {
    mocks.auth.mockResolvedValue({ userId: null, isAuthenticated: false });

    const result = await deleteLogo(LOGO_URL);

    expect(result).toEqual({ success: false, error: "Nie jesteś zalogowany" });
    expect(mocks.deleteFile).not.toHaveBeenCalled();
  });

  test("returns error when getPathFromPublicUrl returns null (invalid URL)", async () => {
    mocks.getPathFromPublicUrl.mockReturnValue(null);

    const result = await deleteLogo("not-a-valid-url");

    expect(result).toEqual({ success: false, error: "Nieprawidłowy URL logo" });
    expect(mocks.deleteFile).not.toHaveBeenCalled();
  });

  test("returns error when deleteFile fails", async () => {
    mocks.deleteFile.mockResolvedValue([{ code: "storage_delete", message: "Failed" }, null]);

    const result = await deleteLogo(LOGO_URL);

    expect(result).toEqual({ success: false, error: "Nie udało się usunąć logo" });
  });

  test("returns success on happy path", async () => {
    const result = await deleteLogo(LOGO_URL);

    expect(result).toEqual({ success: true, data: undefined });
  });

  test("calls getPathFromPublicUrl with the given URL and 'logos' bucket", async () => {
    await deleteLogo(LOGO_URL);

    expect(mocks.getPathFromPublicUrl).toHaveBeenCalledWith(LOGO_URL, "logos");
  });

  test("calls deleteFile with correct bucket and extracted path", async () => {
    await deleteLogo(LOGO_URL);

    expect(mocks.deleteFile).toHaveBeenCalledWith("logos", [FILE_PATH]);
  });
});

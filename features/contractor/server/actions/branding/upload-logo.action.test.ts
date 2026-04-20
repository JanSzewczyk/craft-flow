const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  uploadFile: vi.fn(),
  getPublicUrl: vi.fn()
}));

vi.mock("server-only", () => ({}));
vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }));
vi.mock("~/lib/supabase/storage", () => ({
  uploadFile: mocks.uploadFile,
  getPublicUrl: mocks.getPublicUrl
}));
vi.mock("~/lib/logger", () => {
  const noop = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), child: vi.fn() };
  noop.child.mockReturnValue(noop);
  return { default: noop, createLogger: vi.fn(() => noop) };
});

import { uploadLogoAction } from "~/features/contractor/server/actions/branding/upload-logo.action";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeFile(name: string, type: string, sizeBytes: number): File {
  return new File([new Uint8Array(sizeBytes)], name, { type });
}

function makeFormData(file?: File): FormData {
  const fd = new FormData();
  if (file) fd.set("file", file);
  return fd;
}

const MB = 1024 * 1024;

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("uploadLogoAction", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.auth.mockResolvedValue({ userId: "user-123", isAuthenticated: true });
    mocks.uploadFile.mockResolvedValue([null, { path: "user-123/logo.png" }]);
    mocks.getPublicUrl.mockReturnValue("https://example.com/logo.png");
  });

  test("returns error when unauthenticated", async () => {
    mocks.auth.mockResolvedValue({ userId: null, isAuthenticated: false });

    const result = await uploadLogoAction(makeFormData(makeFile("logo.png", "image/png", MB)));

    expect(result).toEqual({ success: false, error: "Nie jesteś zalogowany" });
    expect(mocks.uploadFile).not.toHaveBeenCalled();
  });

  test("returns error when no file in FormData", async () => {
    const result = await uploadLogoAction(makeFormData());

    expect(result).toEqual({ success: false, error: "Brak pliku" });
    expect(mocks.uploadFile).not.toHaveBeenCalled();
  });

  test("returns error when FormData contains a non-File value", async () => {
    const fd = new FormData();
    fd.set("file", "not-a-file");

    const result = await uploadLogoAction(fd);

    expect(result).toEqual({ success: false, error: "Brak pliku" });
  });

  test("returns error for disallowed MIME type (image/gif)", async () => {
    const result = await uploadLogoAction(makeFormData(makeFile("logo.gif", "image/gif", MB)));

    expect(result).toEqual({ success: false, error: "Dozwolone formaty: PNG, JPG, SVG" });
    expect(mocks.uploadFile).not.toHaveBeenCalled();
  });

  test.each([
    ["image/png", "logo.png"],
    ["image/jpeg", "logo.jpg"],
    ["image/svg+xml", "logo.svg"]
  ])("accepts allowed MIME type: %s", async (mimeType, filename) => {
    const result = await uploadLogoAction(makeFormData(makeFile(filename, mimeType, MB)));

    expect(result.success).toBe(true);
    expect(mocks.uploadFile).toHaveBeenCalledOnce();
  });

  test("returns error when file exceeds 2MB limit", async () => {
    const result = await uploadLogoAction(makeFormData(makeFile("logo.png", "image/png", 3 * MB)));

    expect(result).toEqual({ success: false, error: "Maksymalny rozmiar pliku to 2MB" });
    expect(mocks.uploadFile).not.toHaveBeenCalled();
  });

  test("accepts file exactly at 2MB limit", async () => {
    const result = await uploadLogoAction(makeFormData(makeFile("logo.png", "image/png", 2 * MB)));

    expect(result.success).toBe(true);
  });

  test("returns error when uploadFile fails", async () => {
    mocks.uploadFile.mockResolvedValue([{ code: "storage_upload", message: "Upload failed" }, null]);

    const result = await uploadLogoAction(makeFormData(makeFile("logo.png", "image/png", MB)));

    expect(result).toEqual({ success: false, error: "Nie udało się przesłać logo" });
  });

  test("returns success with URL on happy path", async () => {
    const result = await uploadLogoAction(makeFormData(makeFile("logo.png", "image/png", MB)));

    expect(result).toEqual({ success: true, data: { url: "https://example.com/logo.png" } });
  });

  test("calls uploadFile with correct bucket, path, and options", async () => {
    await uploadLogoAction(makeFormData(makeFile("logo.png", "image/png", MB)));

    expect(mocks.uploadFile).toHaveBeenCalledWith("logos", "user-123/logo.png", expect.any(ArrayBuffer), {
      contentType: "image/png",
      upsert: true
    });
  });

  test("derives path extension from filename", async () => {
    await uploadLogoAction(makeFormData(makeFile("company.svg", "image/svg+xml", MB)));

    expect(mocks.uploadFile).toHaveBeenCalledWith(
      "logos",
      "user-123/logo.svg",
      expect.any(ArrayBuffer),
      expect.objectContaining({ contentType: "image/svg+xml" })
    );
  });

  test("uses getPublicUrl result as the returned URL", async () => {
    mocks.getPublicUrl.mockReturnValue("https://cdn.example.com/logos/user-123/logo.png");

    const result = await uploadLogoAction(makeFormData(makeFile("logo.png", "image/png", MB)));

    expect(result).toEqual({ success: true, data: { url: "https://cdn.example.com/logos/user-123/logo.png" } });
  });
});

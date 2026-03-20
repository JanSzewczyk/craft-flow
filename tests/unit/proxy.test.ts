import { type NextRequest } from "next/server";

// --- Mocks ---

const mocks = vi.hoisted(() => ({
  nextResponseNext: vi.fn(),
  nextResponseRedirect: vi.fn()
}));

let middlewareCallback: (auth: ReturnType<typeof createMockAuth>, request: NextRequest) => Promise<unknown>;

vi.mock("@clerk/nextjs/server", () => ({
  clerkMiddleware: vi.fn((callback: typeof middlewareCallback) => {
    middlewareCallback = callback;
    return callback;
  }),
  createRouteMatcher: vi.fn((patterns: string[]) => {
    return (request: NextRequest) => {
      const url = new URL(request.url);
      return patterns.some((p) => {
        const regex = new RegExp("^" + p.replace("(.*)", ".*") + "$");
        return regex.test(url.pathname);
      });
    };
  })
}));

vi.mock("next/server", () => ({
  NextResponse: {
    next: mocks.nextResponseNext,
    redirect: mocks.nextResponseRedirect
  }
}));

vi.mock("~/lib/logger", () => {
  const noopLogger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    child: vi.fn(() => noopLogger)
  };
  return { default: noopLogger };
});

// --- Helpers ---

function createMockRequest(path: string): NextRequest {
  const url = `http://localhost:3000${path}`;
  return {
    method: "GET",
    url,
    headers: {
      get: vi.fn(() => "test-agent")
    }
  } as unknown as NextRequest;
}

interface MockAuthOptions {
  userId?: string | null;
  sessionClaims?: CustomJwtSessionClaims | null;
}

function createMockAuth({ userId = null, sessionClaims = null }: MockAuthOptions = {}) {
  const authFn = vi.fn(async () => ({ userId, sessionClaims })) as ReturnType<typeof vi.fn> & {
    protect: ReturnType<typeof vi.fn>;
  };
  authFn.protect = vi.fn(async () => undefined);
  return authFn;
}

function createMockResponse() {
  const headers = new Map<string, string>();
  return {
    status: 200,
    headers: {
      set: vi.fn((key: string, value: string) => headers.set(key, value)),
      get: (key: string) => headers.get(key)
    }
  };
}

// --- Import proxy to trigger clerkMiddleware capture ---

beforeAll(async () => {
  await import("~/proxy");
});

// --- Tests ---

describe("proxy middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(crypto, "randomUUID").mockReturnValue(
      "test-request-id" as `${string}-${string}-${string}-${string}-${string}`
    );

    const mockResponse = createMockResponse();
    mocks.nextResponseNext.mockReturnValue(mockResponse);
    mocks.nextResponseRedirect.mockReturnValue({ status: 302 });
  });

  describe("/account-issue page", () => {
    test("redirects unauthenticated user to /sign-in", async () => {
      const request = createMockRequest("/account-issue");
      const auth = createMockAuth({ userId: null });

      await middlewareCallback(auth, request);

      expect(mocks.nextResponseRedirect).toHaveBeenCalledWith(new URL("/sign-in", request.url));
    });

    test("redirects user with roles to /", async () => {
      const request = createMockRequest("/account-issue");
      const auth = createMockAuth({
        userId: "user-1",
        sessionClaims: { metadata: { roles: ["CONTRACTOR"] } }
      });

      await middlewareCallback(auth, request);

      expect(mocks.nextResponseRedirect).toHaveBeenCalledWith(new URL("/", request.url));
    });

    test("allows access for user without metadata", async () => {
      const request = createMockRequest("/account-issue");
      const auth = createMockAuth({
        userId: "user-1",
        sessionClaims: { metadata: undefined }
      });

      await middlewareCallback(auth, request);

      expect(mocks.nextResponseNext).toHaveBeenCalled();
      expect(mocks.nextResponseRedirect).not.toHaveBeenCalled();
    });

    test("allows access for user with empty roles array", async () => {
      const request = createMockRequest("/account-issue");
      const auth = createMockAuth({
        userId: "user-1",
        sessionClaims: { metadata: { roles: [] } }
      });

      await middlewareCallback(auth, request);

      expect(mocks.nextResponseNext).toHaveBeenCalled();
      expect(mocks.nextResponseRedirect).not.toHaveBeenCalled();
    });
  });

  describe("protected routes (e.g. /dashboard)", () => {
    test("calls auth.protect() for unauthenticated user", async () => {
      const request = createMockRequest("/dashboard");
      const auth = createMockAuth({ userId: null });

      await middlewareCallback(auth, request);

      expect(auth.protect).toHaveBeenCalled();
    });

    test("redirects authenticated user without roles to /account-issue", async () => {
      const request = createMockRequest("/dashboard");
      const auth = createMockAuth({
        userId: "user-1",
        sessionClaims: { metadata: { roles: [] } }
      });

      await middlewareCallback(auth, request);

      expect(auth.protect).toHaveBeenCalled();
      expect(mocks.nextResponseRedirect).toHaveBeenCalledWith(new URL("/account-issue", request.url));
    });

    test("allows authenticated user with roles", async () => {
      const request = createMockRequest("/dashboard");
      const auth = createMockAuth({
        userId: "user-1",
        sessionClaims: { metadata: { roles: ["CONTRACTOR"] } }
      });

      await middlewareCallback(auth, request);

      expect(auth.protect).toHaveBeenCalled();
      expect(mocks.nextResponseNext).toHaveBeenCalled();
      expect(mocks.nextResponseRedirect).not.toHaveBeenCalled();
    });
  });

  describe("public non-auth routes (e.g. /pricing)", () => {
    test("allows unauthenticated user", async () => {
      const request = createMockRequest("/pricing");
      const auth = createMockAuth({ userId: null });

      await middlewareCallback(auth, request);

      expect(auth.protect).not.toHaveBeenCalled();
      expect(mocks.nextResponseNext).toHaveBeenCalled();
      expect(mocks.nextResponseRedirect).not.toHaveBeenCalled();
    });

    test("redirects authenticated user without roles to /account-issue", async () => {
      const request = createMockRequest("/pricing");
      const auth = createMockAuth({
        userId: "user-1",
        sessionClaims: { metadata: { roles: [] } }
      });

      await middlewareCallback(auth, request);

      expect(mocks.nextResponseRedirect).toHaveBeenCalledWith(new URL("/account-issue", request.url));
    });

    test("allows authenticated user with roles", async () => {
      const request = createMockRequest("/pricing");
      const auth = createMockAuth({
        userId: "user-1",
        sessionClaims: { metadata: { roles: ["CONTRACTOR"] } }
      });

      await middlewareCallback(auth, request);

      expect(mocks.nextResponseNext).toHaveBeenCalled();
      expect(mocks.nextResponseRedirect).not.toHaveBeenCalled();
    });
  });

  describe("auth flow routes (/sign-in, /sign-up)", () => {
    test("does NOT redirect user without roles on /sign-in", async () => {
      const request = createMockRequest("/sign-in");
      const auth = createMockAuth({
        userId: "user-1",
        sessionClaims: { metadata: { roles: [] } }
      });

      await middlewareCallback(auth, request);

      expect(mocks.nextResponseNext).toHaveBeenCalled();
      expect(mocks.nextResponseRedirect).not.toHaveBeenCalled();
    });

    test("does NOT redirect user without roles on /sign-up", async () => {
      const request = createMockRequest("/sign-up");
      const auth = createMockAuth({
        userId: "user-1",
        sessionClaims: { metadata: { roles: [] } }
      });

      await middlewareCallback(auth, request);

      expect(mocks.nextResponseNext).toHaveBeenCalled();
      expect(mocks.nextResponseRedirect).not.toHaveBeenCalled();
    });
  });

  describe("response headers", () => {
    test("sets X-Request-ID header on successful response", async () => {
      const request = createMockRequest("/pricing");
      const auth = createMockAuth({
        userId: "user-1",
        sessionClaims: { metadata: { roles: ["CONTRACTOR"] } }
      });

      const mockResponse = createMockResponse();
      mocks.nextResponseNext.mockReturnValue(mockResponse);

      await middlewareCallback(auth, request);

      expect(mockResponse.headers.set).toHaveBeenCalledWith("X-Request-ID", "test-request-id");
    });
  });
});

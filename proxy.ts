import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import logger from "~/lib/logger";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
  "/sso-callback(.*)",
  "/pricing(.*)",
  "/features(.*)",
  "/about-us(.*)",
  "/contact(.*)",
  "/terms(.*)",
  "/privacy(.*)",
  "/api/health(.*)",
  "/healthz",
  "/health",
  "/ping",
  "/icon(.*)",
  "/favicon(.*)"
]);

const isAuthFlowRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
  "/sso-callback(.*)"
]);

const isAccountIssuePage = createRouteMatcher(["/account-issue(.*)"]);

function hasRoles(sessionClaims: CustomJwtSessionClaims | null): boolean {
  const roles = sessionClaims?.metadata?.roles;
  return Array.isArray(roles) && roles.length > 0;
}

export const proxy = clerkMiddleware(async (auth, request) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();

  const requestLogger = logger.child({
    requestId,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get("user-agent")
  });

  requestLogger.info("Incoming request");

  // Handle /account-issue page
  if (isAccountIssuePage(request)) {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (hasRoles(sessionClaims)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // User is logged in but has no roles — allow access to error page
    const response = NextResponse.next();
    response.headers.set("X-Request-ID", requestId);
    const duration = Date.now() - startTime;
    requestLogger.info({ status: response.status, duration }, "Request completed");
    return response;
  }

  // Protect non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  // Check roles for authenticated users on non-auth-flow routes
  if (!isAuthFlowRoute(request)) {
    const { userId, sessionClaims } = await auth();

    if (userId && !hasRoles(sessionClaims)) {
      requestLogger.warn({ userId }, "User has no roles assigned, redirecting to account issue page");
      return NextResponse.redirect(new URL("/account-issue", request.url));
    }
  }

  const response = NextResponse.next();

  response.headers.set("X-Request-ID", requestId);

  const duration = Date.now() - startTime;
  requestLogger.info({ status: response.status, duration }, "Request completed");

  return response;
});

// Configure which routes to run proxy on
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
};

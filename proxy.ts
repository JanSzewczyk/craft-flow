import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Role } from "~/features/auth/constants/roles";
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

const isAppRoute = createRouteMatcher(["/app(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);
const isOnboardingSuccessRoute = createRouteMatcher(["/onboarding/success(.*)"]);
const isEntranceRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)"
  // /sso-callback pominięty — jest częścią OAuth flow
]);

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

  // Smart redirect: authenticated users on entrance routes
  if (isEntranceRoute(request)) {
    const { userId, sessionClaims } = await auth();
    if (userId && hasRoles(sessionClaims)) {
      const roles = sessionClaims?.metadata?.roles ?? [];
      const onboardingComplete = sessionClaims?.metadata?.onboardingComplete;
      if (roles.includes(Role.CONTRACTOR)) {
        const destination = onboardingComplete ? "/app/dashboard" : "/onboarding";
        requestLogger.info({ userId, destination }, "Redirecting authenticated user from entrance route");
        return NextResponse.redirect(new URL(destination, request.url));
      }
    }
  }

  // Check roles and onboarding state for authenticated users
  if (!isAuthFlowRoute(request)) {
    const { userId, sessionClaims } = await auth();

    if (userId && !hasRoles(sessionClaims) && !isOnboardingRoute(request)) {
      requestLogger.warn({ userId }, "User has no roles assigned, redirecting to account issue page");
      return NextResponse.redirect(new URL("/account-issue", request.url));
    }

    // Onboarding flow protection for contractors
    if ((isAppRoute(request) || isOnboardingRoute(request)) && userId && sessionClaims) {
      const roles = sessionClaims.metadata?.roles ?? [];
      const onboardingComplete = sessionClaims.metadata?.onboardingComplete;

      if (roles.includes(Role.CONTRACTOR)) {
        if (isAppRoute(request) && !onboardingComplete) {
          return NextResponse.redirect(new URL("/onboarding", request.url));
        }
        if (isOnboardingRoute(request) && !isOnboardingSuccessRoute(request) && onboardingComplete) {
          return NextResponse.redirect(new URL("/app/dashboard", request.url));
        }
      }
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

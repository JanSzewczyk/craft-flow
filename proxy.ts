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
  "/api/health(.*)"
]);

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

  if (!isPublicRoute(request)) {
    await auth.protect();
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

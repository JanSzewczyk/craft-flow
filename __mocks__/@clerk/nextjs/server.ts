import { fn } from "storybook/test";

export const auth = fn(() => ({ userId: "test-user-id" })).mockName("auth");

export const clerkClient = fn(() => ({
  users: {
    updateUserMetadata: fn().mockName("updateUserMetadata")
  }
})).mockName("clerkClient");

export const clerkMiddleware = fn(() => (req: unknown, evt: unknown) => undefined).mockName("clerkMiddleware");

export const createRouteMatcher = fn(() => () => false).mockName("createRouteMatcher");

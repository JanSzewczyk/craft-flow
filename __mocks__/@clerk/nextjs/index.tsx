import * as React from "react";

import { fn } from "storybook/test";

export const SignOutButton = fn(({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
}).mockName("SignOutButton");

export const SignInButton = fn(({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
}).mockName("SignInButton");

export const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const UserButton = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const signOut = fn().mockName("signOut");

export function useClerk() {
  return { signOut };
}

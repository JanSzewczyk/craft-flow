import * as React from "react";

import { type Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@szum-tech/design-system";
import { cookies } from "next/headers";
import { CookieBanner } from "~/components/cookie-banner";
import { ThemeProvider } from "~/components/providers/theme-provider";
import { ToastHandler } from "~/lib/toast/components/toast-handler";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "CraftFlow", template: "%s | CraftFlow" },
  description:
    "CraftFlow – portal dla rzemieślników. Daj klientom dostęp do statusu projektu w czasie rzeczywistym. Koniec z telefonami.",
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const consent = cookieStore.get("cookieConsent")?.value;
  const showBanner = !consent;

  return (
    <ClerkProvider>
      <html lang="pl" suppressHydrationWarning>
        <body>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
            <ToastHandler />
            {showBanner ? <CookieBanner /> : null}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

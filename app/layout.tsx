import * as React from "react";

import { type Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "~/components/providers/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "CraftFlow", template: "%s | CraftFlow" },
  description:
    "CraftFlow – portal dla rzemieślników. Daj klientom dostęp do statusu projektu w czasie rzeczywistym. Koniec z telefonami.",
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html lang="pl" suppressHydrationWarning>
        <body>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

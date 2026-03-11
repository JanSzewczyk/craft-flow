import * as React from "react";

import { type Metadata } from "next";

import { ThemeProvider } from "~/components/providers/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Craft Flow",
  description: "Modern Next.js application template"
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

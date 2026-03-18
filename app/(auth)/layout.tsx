import * as React from "react";

import { ChevronLeftIcon } from "lucide-react";

import { Header } from "@szum-tech/design-system";
import Link from "next/link";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { AuthFooter } from "~/features/auth";
import { BrandLogo } from "~/features/marketing/components/brand-logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header>
        <div className="flex w-full items-center justify-between">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-body-sm flex items-center gap-1 transition-colors"
          >
            <ChevronLeftIcon className="size-4" />
            Wróć do strony głównej
          </Link>
          <ThemeToggle />
        </div>
      </Header>
      <div className="container flex flex-1 flex-col items-center justify-center gap-8 py-8">
        <BrandLogo />
        <div className="w-full max-w-100">{children}</div>
        <AuthFooter />
      </div>
    </div>
  );
}

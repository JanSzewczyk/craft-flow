import * as React from "react";

import { ChevronLeftIcon } from "lucide-react";

import Link from "next/link";
import { AuthFooter } from "~/features/auth";
import { BrandLogo } from "~/features/marketing/components/brand-logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground text-body-sm fixed top-6 left-6 z-50 flex items-center gap-1 transition-colors"
      >
        <ChevronLeftIcon className="size-4" />
        Wróć do strony głównej
      </Link>

      <BrandLogo />

      <div className="w-full max-w-100">{children}</div>

      <AuthFooter />
    </div>
  );
}

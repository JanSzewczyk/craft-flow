import * as React from "react";

import { Header } from "@szum-tech/design-system";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { BrandLogo } from "~/features/marketing/components/brand-logo";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header>
        <div className="flex w-full items-center justify-between">
          <BrandLogo />
          <ThemeToggle />
        </div>
      </Header>
      <div className="container mt-8">{children}</div>
    </div>
  );
}

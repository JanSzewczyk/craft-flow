import * as React from "react";

import { auth } from "@clerk/nextjs/server";
import { Header } from "@szum-tech/design-system";
import { redirect } from "next/navigation";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { Role } from "~/features/auth/constants/roles";
import { BrandLogo } from "~/features/marketing/components/brand-logo";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "client-layout" });

async function loadData() {
  const { isAuthenticated, userId, sessionClaims } = await auth();

  if (!isAuthenticated || !userId) {
    logger.error("User not authenticated on client portal layout");
    redirect("/sign-in");
  }

  const roles = sessionClaims?.metadata?.roles ?? [];
  if (!roles.includes(Role.CLIENT)) {
    logger.warn({ userId }, "Non-client user attempted to access client portal");
    redirect("/");
  }

  logger.info({ userId }, "Client portal layout auth guard passed");
}

export default async function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  await loadData();

  return (
    <div className="flex min-h-screen flex-col">
      <Header>
        <div className="flex w-full items-center justify-between">
          <BrandLogo />
          <ThemeToggle />
        </div>
      </Header>
      <div className="container my-8">{children}</div>
    </div>
  );
}

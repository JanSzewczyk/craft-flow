import * as React from "react";

import { auth } from "@clerk/nextjs/server";
import { SidebarInset, SidebarProvider } from "@szum-tech/design-system";
import { redirect } from "next/navigation";
import { Role } from "~/features/auth/constants/roles";
import { ClientHeader, ClientSidebar } from "~/features/crm/components";
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

export default async function ClientPortalLayout({ children }: LayoutProps<"/client">) {
  await loadData();

  return (
    <SidebarProvider>
      <ClientSidebar />
      <SidebarInset>
        <ClientHeader />
        <div className="container flex w-full flex-1 flex-col p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

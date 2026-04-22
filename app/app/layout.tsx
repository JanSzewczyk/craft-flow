import * as React from "react";

import { SidebarInset, SidebarProvider } from "@szum-tech/design-system";
import { getUserPlan } from "~/features/billing/server";
import { AppHeader, AppSidebar } from "~/features/contractor/components";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [, plan] = await getUserPlan();

  return (
    <SidebarProvider>
      <AppSidebar plan={plan?.name} />
      <SidebarInset>
        <AppHeader />
        <div className="container-7xl w-full flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

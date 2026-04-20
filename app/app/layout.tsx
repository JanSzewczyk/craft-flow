import * as React from "react";

import { SidebarInset, SidebarProvider } from "@szum-tech/design-system";
import { AppHeader, AppSidebar } from "~/features/contractor/components";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

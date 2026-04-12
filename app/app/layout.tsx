import * as React from "react";

import { SidebarInset, SidebarProvider } from "@szum-tech/design-system";
import { AppHeader } from "~/features/contractor/components/app-header";
import { AppSidebar } from "~/features/contractor/components/app-sidebar";

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

"use client";

import { usePathname } from "next/navigation";

import { UserButton } from "@clerk/nextjs";

import {
  Header,
  Separator,
  SidebarTrigger,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage
} from "@szum-tech/design-system";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Panel sterowania",
  projects: "Projekty",
  clients: "Klienci",
  templates: "Szablony",
  settings: "Ustawienia",
  help: "Pomoc"
};

export function AppHeader() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  // segments: ["app", "dashboard", ...] — we want index 1
  const currentSegment = segments[1] ?? "dashboard";
  const label = SEGMENT_LABELS[currentSegment] ?? currentSegment;

  return (
    <Header variant="full">
      <div className="inline-flex w-full items-center gap-x-2">
        <SidebarTrigger />
        <Separator orientation="vertical" />
        <nav className="flex-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>
        <UserButton />
      </div>
    </Header>
  );
}

"use client";

import { usePathname } from "next/navigation";

import { UserButton } from "@clerk/nextjs";

import { Header, Separator, SidebarTrigger } from "@szum-tech/design-system";

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
    <Header>
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />
      <nav className="flex-1">
        <span className="text-sm font-medium">{label}</span>
      </nav>
      <UserButton />
    </Header>
  );
}

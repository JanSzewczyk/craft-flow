"use client";

import { Tabs, TabsList, TabsTrigger } from "@szum-tech/design-system";
import { usePathname, useRouter } from "next/navigation";

const TABS = [
  { value: "/client", label: "Aktywne" },
  { value: "/client/history", label: "Historia" }
] as const;

export function ClientProjectsNav() {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = TABS.find((t) => t.value === pathname)?.value ?? "/client";

  return (
    <Tabs value={activeTab} onValueChange={(value) => router.push(value)}>
      <TabsList>
        {TABS.map(({ value, label }) => (
          <TabsTrigger key={value} value={value}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

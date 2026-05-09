"use client";

import * as React from "react";

import { Tabs, TabsList, TabsTrigger } from "@szum-tech/design-system";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProjectStatusFilter } from "~/features/projects/types/project-filter";

export const PROJECT_STATUS_FILTER_TABS: Array<{ value: ProjectStatusFilter; label: string }> = [
  { value: ProjectStatusFilter.ALL, label: "Wszystkie" },
  { value: ProjectStatusFilter.DRAFT, label: "Szkice" },
  { value: ProjectStatusFilter.ACTIVE, label: "Aktywne" },
  { value: ProjectStatusFilter.COMPLETED, label: "Zakończone" },
  { value: ProjectStatusFilter.ARCHIVED, label: "Archiwum" }
];

type ProjectsTabsNavProps = {
  activeTab: ProjectStatusFilter;
  countBadges: Partial<Record<ProjectStatusFilter, React.ReactNode>>;
};

export function ProjectsTabsNav({ activeTab, countBadges }: ProjectsTabsNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTabChange = React.useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === ProjectStatusFilter.ALL) {
        params.delete("status");
      } else {
        params.set("status", value);
      }
      params.delete("page");
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          {PROJECT_STATUS_FILTER_TABS.map(({ value, label }) => (
            <TabsTrigger key={value} value={value}>
              {label}
              {countBadges[value]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

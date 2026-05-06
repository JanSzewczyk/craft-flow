"use client";

import * as React from "react";

import { Tabs, TabsList, TabsTrigger } from "@szum-tech/design-system";
import Link from "next/link";
import { usePathname } from "next/navigation";

type ProjectDetailTabsNavProps = {
  projectId: string;
  children: React.ReactNode;
};

export function ProjectDetailTabsNav({ projectId, children }: ProjectDetailTabsNavProps) {
  const pathname = usePathname();
  const timelinePath = `/app/projects/${projectId}`;
  const filesPath = `/app/projects/${projectId}/files`;

  return (
    <Tabs value={pathname}>
      <TabsList variant="line">
        <TabsTrigger value={timelinePath} asChild>
          <Link href={timelinePath} className="px-6 py-3 text-sm font-medium transition-colors">
            Oś czasu
          </Link>
        </TabsTrigger>
        <TabsTrigger value={filesPath} asChild>
          <Link href={filesPath} className="px-6 py-3 text-sm font-medium transition-colors">
            Wszystkie pliki
          </Link>
        </TabsTrigger>
      </TabsList>

      {children}
    </Tabs>
  );
}

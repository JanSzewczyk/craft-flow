"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@szum-tech/design-system";

type ProjectDetailTabsNavProps = {
  projectId: string;
};

export function ProjectDetailTabsNav({ projectId }: ProjectDetailTabsNavProps) {
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
    </Tabs>
    // <div className="border-border flex border-b">
    //   {tabs.map((tab) => (
    //     <Link
    //       key={tab.href}
    //       href={tab.href}
    //       className={[
    //         "px-6 py-3 text-sm font-medium transition-colors",
    //         tab.active ? "border-primary text-primary border-b-2" : "text-muted-foreground hover:text-foreground"
    //       ].join(" ")}
    //     >
    //       {tab.label}
    //     </Link>
    //   ))}
    // </div>
  );
}

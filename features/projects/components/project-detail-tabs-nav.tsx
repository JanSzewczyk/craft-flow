"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type ProjectDetailTabsNavProps = {
  projectId: string;
};

export function ProjectDetailTabsNav({ projectId }: ProjectDetailTabsNavProps) {
  const pathname = usePathname();
  const timelinePath = `/app/projects/${projectId}`;
  const filesPath = `/app/projects/${projectId}/files`;

  const tabs = [
    { href: timelinePath, label: "Oś czasu", active: pathname === timelinePath },
    { href: filesPath, label: "Wszystkie pliki", active: pathname === filesPath }
  ];

  return (
    <div className="border-border flex border-b">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={[
            "px-6 py-3 text-sm font-medium transition-colors",
            tab.active ? "border-primary text-primary border-b-2" : "text-muted-foreground hover:text-foreground"
          ].join(" ")}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

"use client";

import * as React from "react";

import { MailIcon } from "lucide-react";

import { Card } from "@szum-tech/design-system";

export type LegalSidebarSection = {
  id: string;
  number: number;
  title: string;
  icon: React.ReactNode;
};

type LegalSidebarProps = {
  sections: readonly LegalSidebarSection[];
  helpEmail?: string;
};

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function LegalSidebar({ sections, helpEmail }: LegalSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-24">
        <p className="text-body-sm text-muted-foreground mb-3 uppercase">Spis treści</p>
        <nav>
          <ul className="space-y-1">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className="text-body-sm text-muted-foreground hover:text-foreground flex w-full items-center gap-2 rounded px-2 py-1.5 text-left transition-colors"
                >
                  <span className="text-primary shrink-0" aria-hidden>
                    {section.icon}
                  </span>
                  <span>
                    §{section.number}. {section.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        {helpEmail && (
          <Card className="mt-6 p-4">
            <p className="text-body-sm text-muted-foreground mb-2">Masz pytania?</p>
            <a
              href={`mailto:${helpEmail}`}
              className="text-body-sm text-primary flex items-center gap-2 hover:underline"
            >
              <MailIcon className="size-4 shrink-0" aria-hidden />
              {helpEmail}
            </a>
          </Card>
        )}
      </div>
    </aside>
  );
}

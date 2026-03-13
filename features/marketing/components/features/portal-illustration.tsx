import { Monitor } from "lucide-react";

import { IllustrationCard } from "./illustration-card";

export function PortalIllustration() {
  return (
    <IllustrationCard
      gradientClass="from-primary/10 to-primary/5"
      icon={<Monitor className="h-16 w-16 text-primary opacity-20" aria-hidden="true" />}
      cardTitle="Portal projektu"
    >
      <div className="bg-muted/50 mb-2 flex items-center gap-2 rounded px-2 py-1.5">
        <div className="bg-muted h-2 w-2 rounded-full" aria-hidden="true" />
        <span className="text-body-xs text-muted-foreground">craftflow.app/projekt/abc123</span>
      </div>
      <p className="text-body-xs text-muted-foreground">Otwórz link — bez logowania, bez aplikacji.</p>
    </IllustrationCard>
  );
}

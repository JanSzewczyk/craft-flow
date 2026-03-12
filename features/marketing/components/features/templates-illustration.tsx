import { LayoutTemplate } from "lucide-react";

import { IllustrationCard } from "./illustration-card";

const TEMPLATES = ["Stolarz — meble na wymiar", "Elektryk — instalacja", "Glazurnik — łazienka"] as const;

export function TemplatesIllustration() {
  return (
    <IllustrationCard
      gradientClass="from-warning/10 to-warning/5"
      icon={<LayoutTemplate className="text-warning h-16 w-16 opacity-20" aria-hidden="true" />}
      cardTitle="Wybierz szablon"
    >
      <div className="flex flex-col gap-1.5">
        {TEMPLATES.map((template, i) => (
          <div
            key={template}
            className={`text-body-xs rounded px-2 py-1 ${i === 0 ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}
          >
            {template}
          </div>
        ))}
      </div>
    </IllustrationCard>
  );
}

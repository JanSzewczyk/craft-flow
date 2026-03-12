import { CheckCircle2, Clock } from "lucide-react";

import { IllustrationCard } from "./illustration-card";

const STEPS = [
  { label: "Wycena zaakceptowana", done: true },
  { label: "Materiały zamówione", done: true },
  { label: "Produkcja w toku", done: false, active: true },
  { label: "Montaż u klienta", done: false }
] as const;

export function TimelineIllustration() {
  return (
    <IllustrationCard
      gradientClass="from-primary/10 to-primary/5"
      icon={<Clock className="text-primary h-16 w-16 opacity-20" aria-hidden="true" />}
      cardTitle="Szafa na wymiar — Kowalski"
    >
      <div className="flex flex-col gap-2">
        {STEPS.map((step) => (
          <div key={step.label} className="flex items-center gap-2">
            <CheckCircle2
              className={`h-3.5 w-3.5 shrink-0 ${step.done ? "text-success" : "active" in step && step.active ? "text-primary" : "text-muted-foreground"}`}
              aria-hidden="true"
            />
            <span
              className={`text-body-xs ${"active" in step && step.active ? "text-foreground font-medium" : step.done ? "text-foreground" : "text-muted-foreground"}`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </IllustrationCard>
  );
}

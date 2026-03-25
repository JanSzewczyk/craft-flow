"use client";

import * as React from "react";

import { CheckCircle2 } from "lucide-react";

import { Badge, Button, Card } from "@szum-tech/design-system";
import { cn } from "@szum-tech/design-system/utils";
import { type Plan } from "~/features/billing";
import { type RedirectAction } from "~/lib/action-types";

export type PricingCardProps = {
  plan: Plan;
  onSelectAction: (planId: string) => RedirectAction;
};

export function PricingCard({ plan, onSelectAction }: PricingCardProps) {
  return (
    <Card
      data-slot="pricing-card"
      className={cn(
        "relative h-full",
        "border transition-all hover:shadow-xl",
        plan.featured ? "border-primary shadow-2xl md:scale-110" : "hover:shadow-lg"
      )}
    >
      {plan.featured ? (
        <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
          <Badge>Najlepszy wybór</Badge>
        </div>
      ) : null}

      <div className="flex flex-col p-8">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-heading-h3 mb-2">{plan.name}</h3>
          <p className="text-body-sm text-muted-foreground mb-6">{plan.description}</p>
          <div className="flex items-baseline gap-1">
            <span className="font-code text-display-sm">{plan.price} PLN</span>
            <span className="text-mute">/miesiąc</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          fullWidth
          size="lg"
          variant={plan.featured ? "default" : plan.trial ? "outline" : "secondary"}
          onClick={() => onSelectAction(plan.id)}
        >
          {plan.trial ? `Wyprubuje 14-dniowy trial ${plan.name}` : `Wybieram ${plan.name}`}
        </Button>

        {/* Features List */}
        <ul className="mt-8 grow space-y-4" aria-label={`${plan.name} plan features`}>
          {plan.features.map((feature, index) => (
            <li key={`${plan.id}-feature-${index}`} className="flex items-center gap-3 text-sm">
              <CheckCircle2 aria-hidden="true" className="text-success size-5 shrink-0" />
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

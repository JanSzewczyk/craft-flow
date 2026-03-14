import * as React from "react";

import { CheckCircle2, X } from "lucide-react";

import { Badge, Button, Card } from "@szum-tech/design-system";
import { cn } from "@szum-tech/design-system/utils";
import { type PricingPlan } from "~/features/marketing/constants/pricing";

export type PricingCardProps = {
  plan: PricingPlan;
  className?: string;
};

export function PricingCard({ plan, className }: PricingCardProps) {
  const { name, description, price, period, buttonLabel, buttonVariant, featured, features } = plan;

  const CheckIcon = CheckCircle2;
  const CrossIcon = X;

  return (
    <Card
      data-slot="pricing-card"
      className={cn(
        "relative h-full",
        "border transition-all hover:shadow-xl",
        featured ? "border-primary shadow-2xl md:scale-110" : "hover:shadow-lg",
        className
      )}
    >
      {featured ? (
        <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
          <Badge>Najlepszy wybór</Badge>
        </div>
      ) : null}

      <div className={cn("flex flex-col p-8", featured && "pt-10")}>
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-heading-h3 mb-2">{name}</h3>
          <p className="text-body-sm text-muted-foreground mb-6">{description}</p>
          <div className="flex items-baseline gap-1">
            <span className="font-code text-display-sm">{price} PLN</span>
            <span className="text-mute">/{period}</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button className="mb-8" fullWidth size="lg" variant={buttonVariant}>
          {buttonLabel}
        </Button>

        {/* Features List */}
        <ul className="grow space-y-4" aria-label={`${name} plan features`}>
          {features.map((feature, index) => (
            <li key={`${plan.id}-feature-${index}`} className="flex items-center gap-3 text-sm">
              {feature.included ? (
                <CheckIcon aria-hidden="true" className="text-success size-5 shrink-0" />
              ) : (
                <CrossIcon aria-hidden="true" className="text-muted-foreground/50 size-5 shrink-0" />
              )}
              <span className={cn("text-foreground", !feature.included && "text-muted-foreground line-through")}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

import * as React from "react";

import { type LucideIcon } from "lucide-react";

import { Badge, type BadgeVariant, Button } from "@szum-tech/design-system";
import Link from "next/link";

export type FeaturePoint = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type StatCard = {
  value: string;
  label: string;
};

export type FeatureSectionProps = {
  heading: string;
  featurePoints?: FeaturePoint[];
  stats?: StatCard[];
  description?: string;
  illustration: React.ReactNode;
  /** Optional badge */
  badge?: {
    label: string;
    icon: LucideIcon;
    variant?: BadgeVariant;
  };
  /** Optional CTA button label - when undefined, no button is shown */
  ctaLabel?: string;
  /** Optional CTA button href - defaults to "/pricing" */
  ctaHref?: string;
  /** Optional CTA button icon */
  ctaIcon?: React.ReactElement;
  /** Layout direction - "normal" for text left/visual right, "reversed" for visual left/text right */
  layout?: "normal" | "reversed";
};

export function FeatureSection({
  heading,
  featurePoints,
  stats,
  description,
  illustration,
  badge,
  ctaLabel,
  ctaHref = "/pricing",
  ctaIcon,
  layout = "normal"
}: FeatureSectionProps) {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-6">
        <div className={`grid items-center gap-12 lg:grid-cols-2 ${layout === "reversed" ? "lg:grid-flow-dense" : ""}`}>
          {/* Text side - order depends on layout */}
          <div className={`flex flex-col ${layout === "reversed" ? "lg:col-start-2" : ""}`}>
            {/* Badge */}
            {badge ? (
              <Badge variant={badge.variant}>
                <badge.icon aria-hidden="true" /> {badge.label}
              </Badge>
            ) : null}
            {/* Heading */}
            <h2 className="text-heading-h1 text-foreground mb-4">{heading}</h2>
            {/* Description */}
            {description ? <p className="text-body-lg text-muted-foreground mb-6">{description}</p> : null}
            {/* Feature points with icons */}
            {featurePoints && (
              <ul className="mb-6 flex flex-col gap-4" aria-label="Szczegóły funkcji">
                {featurePoints.map((point) => (
                  <li key={point.title} className="flex items-start gap-3">
                    <point.icon className="text-primary mt-0.5 size-5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-body-default text-foreground font-bold">{point.title}</p>
                      <p className="text-body-sm text-muted-foreground">{point.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* Stats grid */}
            {stats && (
              <div className="mb-6 grid grid-cols-2 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-card text-card-foreground border-border rounded-xl border p-4">
                    <div className="text-primary mb-1 text-3xl font-black">{stat.value}</div>
                    <p className="text-body-sm text-foreground font-bold">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
            {/* CTA Button */}
            {ctaLabel && (
              <div className="flex items-center gap-4 pt-4">
                <Button size="lg" asChild startIcon={ctaIcon}>
                  <Link href={ctaHref}>{ctaLabel}</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Illustration side - order depends on layout */}
          <div
            className={`flex items-center justify-center py-5 ${layout === "reversed" ? "lg:col-start-1 lg:row-start-1" : ""}`}
          >
            <div className="w-full">{illustration}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

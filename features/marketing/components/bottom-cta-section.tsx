import { Clock, Users } from "lucide-react";

import { Button } from "@szum-tech/design-system";
import Link from "next/link";

type BottomCtaSectionProps = {
  heading: string;
  subheading?: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  note?: string;
  urgencyMessage?: string;
  socialProofCount?: string;
  socialProofLabel?: string;
};

export function BottomCtaSection({
  heading,
  subheading,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  note,
  urgencyMessage,
  socialProofCount,
  socialProofLabel
}: BottomCtaSectionProps) {
  return (
    <section className="bg-primary text-primary-foreground py-20 sm:py-24">
      <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-display-sm">{heading}</h2>
        {subheading && <p className="text-body-lg mx-auto mt-4 max-w-xl opacity-90">{subheading}</p>}

        {/* Social Proof */}
        {socialProofCount && socialProofLabel && (
          <div className="text-body-sm mb-6 flex items-center justify-center gap-2">
            <Users className="h-4 w-4" />
            <span className="opacity-80">
              {socialProofLabel} <span className="font-bold">{socialProofCount}</span>
            </span>
          </div>
        )}

        {/* CTA Buttons with Urgency */}
        <div className="relative">
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild variant="secondary" size="lg">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
            {secondaryCtaLabel && secondaryCtaHref && (
              <Button asChild variant="link" size="lg" className="text-primary-foreground/90">
                <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
              </Button>
            )}
          </div>

          {/* Urgency Message */}
          {urgencyMessage && (
            <div className="text-body-sm absolute right-0 -bottom-8 left-0 flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 text-yellow-300" />
              <span className="animate-pulse font-semibold">{urgencyMessage}</span>
            </div>
          )}
        </div>

        {note && <p className="text-body-sm mt-4 opacity-75">{note}</p>}
      </div>
    </section>
  );
}

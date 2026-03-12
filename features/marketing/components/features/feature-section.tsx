import { CheckCircle2 } from "lucide-react";

import { Badge } from "@szum-tech/design-system";

export type BulletPoint = {
  text: string;
};

export type FeatureSectionProps = {
  badge: string;
  heading: string;
  description: string;
  bullets: BulletPoint[];
  illustration: React.ReactNode;
  /** When true the illustration is on the left, text on the right (odd sections) */
  illustrationFirst: boolean;
};

export function FeatureSection({
  badge,
  heading,
  description,
  bullets,
  illustration,
  illustrationFirst
}: FeatureSectionProps) {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* On mobile: illustration always first (natural order), on desktop: swap via order utilities */}
          <div className={illustrationFirst ? "lg:order-1" : "lg:order-2"}>{illustration}</div>

          {/* Text side */}
          <div className={`flex flex-col gap-6 ${illustrationFirst ? "lg:order-2" : "lg:order-1"}`}>
            <Badge variant="outline">{badge}</Badge>
            <h2 className="text-display-sm font-poppins text-foreground">{heading}</h2>
            <p className="text-body-lg text-muted-foreground">{description}</p>
            <ul className="flex flex-col gap-3" aria-label="Szczegóły funkcji">
              {bullets.map((bullet) => (
                <li key={bullet.text} className="flex items-start gap-3">
                  <CheckCircle2 className="text-success mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="text-body-default text-foreground">{bullet.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

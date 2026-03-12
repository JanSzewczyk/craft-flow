import { Button } from "@szum-tech/design-system";
import Link from "next/link";

type BottomCtaSectionProps = {
  heading: string;
  subheading?: string;
  ctaLabel: string;
  ctaHref: string;
  note?: string;
};

export function BottomCtaSection({ heading, subheading, ctaLabel, ctaHref, note }: BottomCtaSectionProps) {
  return (
    <section className="bg-primary text-primary-foreground py-20 sm:py-24">
      <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-poppins text-display-sm">{heading}</h2>
        {subheading && <p className="text-body-lg mx-auto mt-4 max-w-xl opacity-90">{subheading}</p>}
        <div className="mt-8 flex flex-col items-center gap-4">
          <Button asChild variant="secondary" size="lg">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
          {note && <p className="text-body-sm opacity-75">{note}</p>}
        </div>
      </div>
    </section>
  );
}

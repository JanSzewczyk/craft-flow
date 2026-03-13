import { CheckCircle2 } from "lucide-react";

import Link from "next/link";

export type BulletPoint = {
  text: string;
};

export type FeatureSectionProps = {
  heading: string;
  bullets: BulletPoint[];
  illustration: React.ReactNode;
  /** Optional CTA button label - when undefined, no button is shown */
  ctaLabel?: string;
  /** Optional CTA button href - defaults to "/pricing" */
  ctaHref?: string;
  /** Layout direction - "normal" for text left/visual right, "reversed" for visual left/text right */
  layout?: "normal" | "reversed";
};

export function FeatureSection({
  heading,
  bullets,
  illustration,
  ctaLabel,
  ctaHref = "/pricing",
  layout = "normal",
}: FeatureSectionProps) {
  return (
    <section className="bg-white py-[48px]">
      <div className="container mx-auto px-6 lg:px-6">
        <div
          className={`grid items-center gap-8 lg:grid-cols-2 ${
            layout === "reversed" ? "lg:grid-flow-dense" : ""
          }`}
        >
          {/* Text side - order depends on layout */}
          <div className={`flex flex-col ${layout === "reversed" ? "lg:col-start-2" : ""}`}>
            <h2 className="text-[24px] font-bold text-black mb-4 font-poppins">{heading}</h2>
            {bullets && (
              <ul className="flex flex-col gap-3 mb-6" aria-label="Szczegóły funkcji">
                {bullets.map((bullet) => (
                  <li key={bullet.text} className="flex items-start gap-3">
                    <CheckCircle2
                      className="text-[#2563EB] mt-0.5 h-5 w-5 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-[16px] font-normal text-[#000000] leading-relaxed">
                      {bullet.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {ctaLabel && (
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center rounded-[8px] px-6 py-[12px] text-[16px] font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                style={{
                  backgroundColor: "#2563EB",
                  width: "140px",
                  height: "40px",
                  padding: "12px",
                }}
              >
                {ctaLabel}
              </Link>
            )}
          </div>

          {/* Illustration side - order depends on layout */}
          <div
            className={`flex items-center justify-center py-5 ${layout === "reversed" ? "lg:col-start-1 lg:row-start-1" : ""}`}
          >
            <div className="w-full overflow-hidden rounded-[10px] border border-border bg-[#F3F4F6]">
              {illustration}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

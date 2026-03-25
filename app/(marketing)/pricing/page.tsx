import { type Metadata } from "next";

import { PricingCardsSection, PricingFAQ } from "~/features/marketing/components";

export const metadata: Metadata = {
  title: "Cennik",
  description:
    "Sprawdź plany CraftFlow – Basic 79 PLN, Standard 149 PLN, Premium 299 PLN. Zacznij z 14-dniowym bezpłatnym okresem próbnym.",
  openGraph: {
    title: "Cennik CraftFlow – Wybierz plan dla swojego warsztatu",
    description: "14 dni Premium za darmo. Bez karty kredytowej.",
    type: "website"
  }
};

export default async function PricingPage() {
  return (
    <div className="bg-muted/30">
      <PricingCardsSection />

      {/* Separator */}
      <hr className="mx-auto max-w-3xl border-t" />

      {/* FAQ Section */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-display-sm">Często zadawane pytania</h2>
        </div>

        <div className="mx-auto max-w-3xl">
          <PricingFAQ />
        </div>
      </section>
    </div>
  );
}

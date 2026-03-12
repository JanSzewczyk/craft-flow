import { type Metadata } from "next";

import { PricingTable } from "@clerk/nextjs";
import { Separator } from "@szum-tech/design-system";
import { PricingFAQ } from "~/features/marketing/components";

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

export default function PricingPage() {
  return (
    <main>
      {/* Pricing Cards Section */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="text-display-md mb-4">Wybierz plan dla swojego warsztatu</h1>
          <p className="text-lead">
            Każdy nowy użytkownik otrzymuje 14 dni bezpłatnego dostępu do planu Premium — bez karty kredytowej.
          </p>
        </div>
        <PricingTable for="user" />
      </section>

      <Separator />

      {/* FAQ Section */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-display-sm">Najczęściej zadawane pytania</h2>
        </div>

        <div className="mx-auto max-w-3xl">
          <PricingFAQ />
        </div>
      </section>
    </main>
  );
}

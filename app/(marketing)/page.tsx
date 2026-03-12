import { type Metadata } from "next";

import {
  BottomCtaSection,
  HeroSection,
  TestimonialsSection,
  WhyCraftFlowSection
} from "~/features/marketing/components";

export const metadata: Metadata = {
  title: "Strona główna",
  description:
    "CraftFlow – koniec z telefonami od klientów. Portal dla rzemieślników, który pokazuje klientom postęp projektu w czasie rzeczywistym.",
  openGraph: {
    title: "CraftFlow – Portal dla rzemieślników",
    description: "Daj klientom link, nie numer telefonu. Pierwsze 14 dni za darmo.",
    type: "website"
  }
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyCraftFlowSection />
      <TestimonialsSection />
      <BottomCtaSection
        heading="Gotowy na spokojniejszą pracę?"
        subheading="Dołącz do rzemieślników, którzy odzyskali swój czas. Pierwsze 14 dni bezpłatnie."
        ctaLabel="Zacznij bezpłatny okres próbny"
        ctaHref="/pricing"
        note="Bez karty kredytowej • Anuluj w dowolnym momencie"
      />
    </>
  );
}

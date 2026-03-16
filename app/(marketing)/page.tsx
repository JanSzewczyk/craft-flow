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
        heading="Gotowy na rewolucję w swoim warsztacie?"
        subheading="Zacznij korzystać z CraftFlow już dzisiaj. Pierwsze 14 dni za darmo."
        ctaLabel="Załóż darmowe konto"
        ctaHref="/pricing"
        secondaryCtaLabel="Skontaktuj się z nami"
        secondaryCtaHref="/contact"
        urgencyMessage="Tylko 10 miejsc w tym miesiącu"
        socialProofCount="500+"
        socialProofLabel="warsztatów już korzysta"
      />
    </>
  );
}

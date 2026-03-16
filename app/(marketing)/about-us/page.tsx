import { type Metadata } from "next";

import {
  AboutHeroSection,
  BottomCtaSection,
  HistorySection,
  TeamSection,
  ValuesSection
} from "~/features/marketing/components";

export const metadata: Metadata = {
  title: "O nas",
  description:
    "Poznaj historię CraftFlow – zbudowane przez rzemieślnika dla rzemieślników. Nasza misja: koniec z telefonami od klientów.",
  openGraph: {
    title: "O nas – CraftFlow",
    description: "Zbudowane przez rzemieślnika dla rzemieślników.",
    type: "website"
  }
};

export default function AboutUsPage() {
  return (
    <div className="bg-muted/30">
      <AboutHeroSection />
      <HistorySection />
      <ValuesSection />
      <TeamSection />
      <BottomCtaSection
        heading="Dołącz do społeczności rzemieślników"
        subheading="Zacznij 14-dniowy bezpłatny okres próbny. Bez karty kredytowej."
        ctaLabel="Wypróbuj CraftFlow za darmo"
        ctaHref="/pricing"
        urgencyMessage="Ostatnia szansa na ten miesiąc"
        socialProofCount="200+"
        socialProofLabel="klientów zadowolonych"
      />
    </div>
  );
}

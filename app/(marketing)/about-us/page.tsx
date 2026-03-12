import { type Metadata } from "next";

import { BottomCtaSection, HistorySection, TeamSection, ValuesSection } from "~/features/marketing/components";

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
    <>
      <HistorySection />
      <ValuesSection />
      <TeamSection />
      <BottomCtaSection
        heading="Dołącz do społeczności rzemieślników"
        subheading="Zacznij 14-dniowy bezpłatny okres próbny. Bez karty kredytowej."
        ctaLabel="Wypróbuj CraftFlow za darmo"
        ctaHref="/pricing"
      />
    </>
  );
}

import { type Metadata } from "next";

import {
  CrmDashboardIllustration,
  FeatureSection,
  FeaturesHero,
  SmartLinksIllustration,
  TimeTrackingIllustration
} from "~/features/marketing/components";

export const metadata: Metadata = {
  title: "Funkcje",
  description:
    "Oś czasu projektu, portal klienta, CRM, szablony etapów i automatyczne maile – wszystko w jednym narzędziu dla rzemieślników.",
  openGraph: {
    title: "Funkcje CraftFlow",
    description: "Wszystko, czego potrzebujesz do zarządzania zleceniami.",
    type: "website"
  }
};

export default function FeaturesPage() {
  return (
    <>
      <FeaturesHero />

      {/* Feature 1: Inteligentna Os Czasu. - TEXT LEFT, VISUAL RIGHT */}
      <FeatureSection
        heading="Inteligentna Os Czasu."
        bullets={[{ text: "Zarządzaj czasem pracy" }, { text: "Optymalizuj harmonogram" }]}
        ctaLabel="Dowiedz się więcej"
        layout="normal"
        illustration={<TimeTrackingIllustration />}
      />

      {/* Feature 2: Smart Linki: Zapamiętaj o hasłach. - VISUAL LEFT, TEXT RIGHT */}
      <FeatureSection
        heading="Smart Linki: Zapamiętaj o hasłach."
        bullets={[{ text: "Bezpieczne przechowywanie haseł" }, { text: "Szybki dostęp do linków" }]}
        layout="reversed"
        illustration={<SmartLinksIllustration />}
      />

      {/* Feature 3: CRM dla Remontu. - TEXT LEFT, VISUAL RIGHT */}
      <FeatureSection
        heading="CRM dla Remontu."
        bullets={[{ text: "Zarządzaj klientami" }, { text: "Śledź postępy napraw" }]}
        ctaLabel="Zobacz więcej"
        layout="normal"
        illustration={<CrmDashboardIllustration />}
      />
    </>
  );
}

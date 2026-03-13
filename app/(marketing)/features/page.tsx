import { CameraIcon, CheckCircle, Link as LinkIcon, Shield, Smartphone } from "lucide-react";
import { type Metadata } from "next";

import {
  CrmDashboardIllustration,
  FeatureSection,
  FeaturesHero,
  SmartLinksIllustration,
  TimelineIllustration
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
    <div className="bg-muted/30">
      <FeaturesHero />

      {/* Feature 1: Timeline - TEXT LEFT, VISUAL RIGHT */}
      <FeatureSection
        heading="Inteligentna Oś Czasu."
        description="Dodawaj etapy, wgrywaj zdjęcia i publikuj postępy jednym kliknięciem. System sam powiadomi klienta o aktualnym statusie prac."
        badge={{
          label: "Automatyczne powiadomienia",
          icon: CheckCircle,
          variant: "success"
        }}
        ctaLabel="Dodaj postęp"
        ctaIcon={<CameraIcon />}
        layout="normal"
        illustration={<TimelineIllustration />}
      />

      {/* Feature 2: Smart Links - VISUAL LEFT, TEXT RIGHT */}
      <FeatureSection
        heading="Smart Linki. Zapomnij o hasłach."
        description="Klient otrzymuje unikalny, bezpieczny link, który otwiera jego osobisty portal na dowolnym urządzeniu. Żadnego logowania, żadnego przypominania haseł."
        badge={{
          label: "Smart Linki",
          icon: LinkIcon,
          variant: "primary"
        }}
        featurePoints={[
          {
            icon: Shield,
            title: "Bezpieczny dostęp",
            description: "Unikalne tokeny dla każdego klienta i projektu."
          },
          {
            icon: Smartphone,
            title: "W pełni responsywne",
            description: "Idealnie działa na smartfonach, tabletach i desktopach."
          }
        ]}
        layout="reversed"
        illustration={<SmartLinksIllustration />}
      />

      {/* Feature 3: CRM - TEXT LEFT, VISUAL RIGHT */}
      <FeatureSection
        heading="CRM dla Rzemieślnika."
        description="Pełna baza klientów z historią wszystkich realizacji. Wszystko w jednym miejscu, bezpieczne i zgodne z RODO. Już nigdy nie zgubisz numeru do ulubionego klienta."
        badge={{
          label: "CRM & RODO",
          icon: Shield,
          variant: "primary"
        }}
        stats={[
          { value: "100%", label: "Zgodność z RODO" },
          { value: "∞", label: "Historia prac" }
        ]}
        layout="normal"
        illustration={<CrmDashboardIllustration />}
      />
    </div>
  );
}

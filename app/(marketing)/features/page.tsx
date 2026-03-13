import { CameraIcon } from "lucide-react";
import { type Metadata } from "next";

import {
  CrmDashboardIllustration,
  FeatureSection,
  FeaturesHero,
  SmartLinksIllustration,
  TimelineIllustration
} from "~/features/marketing/components";
import { FEATURES_CONFIG } from "~/features/marketing/constants";

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

const ILLUSTRATIONS = {
  timeline: <TimelineIllustration />,
  smartLinks: <SmartLinksIllustration />,
  crmDashboard: <CrmDashboardIllustration />
} as const;

const CTA_ICONS = {
  camera: <CameraIcon aria-hidden="true" />
} as const;

export default function FeaturesPage() {
  return (
    <div className="bg-muted/30">
      <FeaturesHero />

      {FEATURES_CONFIG.map((config) => (
        <FeatureSection
          key={config.heading}
          heading={config.heading}
          description={config.description}
          badge={config.badge}
          featurePoints={config.featurePoints}
          stats={config.stats}
          ctaLabel={config.ctaLabel}
          ctaIcon={config.ctaIcon ? CTA_ICONS[config.ctaIcon] : undefined}
          ctaHref={config.ctaHref}
          layout={config.layout}
          illustration={ILLUSTRATIONS[config.illustrationKey]}
        />
      ))}
    </div>
  );
}

import { CheckCircle, LinkIcon, Shield, Smartphone } from "lucide-react";

import { type FeatureSectionProps } from "~/features/marketing/components";

export type FeatureSectionConfig = Omit<FeatureSectionProps, "illustration" | "ctaIcon"> & {
  illustrationKey: "timeline" | "smartLinks" | "crmDashboard";
  ctaIcon?: "camera";
};

export const FEATURES_CONFIG: FeatureSectionConfig[] = [
  {
    heading: "Inteligentna Oś Czasu.",
    description:
      "Dodawaj etapy, wgrywaj zdjęcia i publikuj postępy jednym kliknięciem. System sam powiadomi klienta o aktualnym statusie prac.",
    badge: {
      label: "Automatyczne powiadomienia",
      icon: CheckCircle,
      variant: "success"
    },
    ctaLabel: "Dodaj postęp",
    ctaIcon: "camera",
    layout: "normal",
    illustrationKey: "timeline"
  },
  {
    heading: "Smart Linki. Zapomnij o hasłach.",
    description:
      "Klient otrzymuje unikalny, bezpieczny link, który otwiera jego osobisty portal na dowolnym urządzeniu. Żadnego logowania, żadnego przypominania haseł.",
    badge: {
      label: "Smart Linki",
      icon: LinkIcon,
      variant: "primary"
    },
    featurePoints: [
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
    ],
    layout: "reversed",
    illustrationKey: "smartLinks"
  },
  {
    heading: "CRM dla Rzemieślnika.",
    description:
      "Pełna baza klientów z historią wszystkich realizacji. Wszystko w jednym miejscu, bezpieczne i zgodne z RODO. Już nigdy nie zgubisz numeru do ulubionego klienta.",
    badge: {
      label: "CRM & RODO",
      icon: Shield,
      variant: "primary"
    },
    stats: [
      { value: "100%", label: "Zgodność z RODO" },
      { value: "∞", label: "Historia prac" }
    ],
    layout: "normal",
    illustrationKey: "crmDashboard"
  }
];

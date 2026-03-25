export const PlanId = {
  BASIC: "basic",
  STANDARD: "standard",
  PREMIUM: "premium"
} as const;

export type PlanId = (typeof PlanId)[keyof typeof PlanId];

export type PhotoResolution = "standard" | "hd" | "4k";

export type PlanLimits = {
  projectsPerMonth: number | null;
  templates: number | null;
  photosPerProject: number | null;
  photoResolution: PhotoResolution;
  branding: boolean;
  whitelabelEmails: boolean;
  supportResponseHours: number | null;
};

export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  currency: string;
  description: string;
  trial: boolean;
  featured: boolean;
  features: readonly string[];
  limits: PlanLimits;
  clerkSlug: string;
};

export const PLANS: readonly Plan[] = [
  {
    id: PlanId.BASIC,
    name: "Basic",
    price: 79,
    currency: "PLN",
    description: "Idealne na start – kontroluj projekty i buduj zaufanie klientów.",
    trial: true,
    featured: false,
    features: [
      "Do 5 nowych projektów miesięcznie",
      "Do 2 szablonów etapów",
      "Do 10 zdjęć na projekt",
      "Dostęp do historii i archiwum",
      "Portal klienta (logowanie)",
      "Standardowa jakość zdjęć",
      "Wsparcie e-mail (do 48h)"
    ],
    limits: {
      projectsPerMonth: 5,
      templates: 2,
      photosPerProject: 10,
      photoResolution: "standard",
      branding: false,
      whitelabelEmails: false,
      supportResponseHours: 48
    },
    clerkSlug: "basic"
  },
  {
    id: PlanId.STANDARD,
    name: "Standard",
    price: 149,
    currency: "PLN",
    description: "Dla rozwijających się warsztatów – własny branding i bez limitów zdjęć.",
    featured: true,
    trial: false,
    features: [
      "Do 20 nowych projektów miesięcznie",
      "Do 10 szablonów etapów",
      "Nieograniczona liczba zdjęć HD",
      "Dostęp do historii i archiwum",
      "Portal klienta (logowanie)",
      "Własne logo i kolory (branding)",
      "Maile systemowe z Twoim wyglądem",
      "Wsparcie e-mail (do 24h)"
    ],
    limits: {
      projectsPerMonth: 20,
      templates: 10,
      photosPerProject: null,
      photoResolution: "hd",
      branding: true,
      whitelabelEmails: true,
      supportResponseHours: 24
    },
    clerkSlug: "standard"
  },
  {
    id: PlanId.PREMIUM,
    name: "Premium",
    price: 299,
    currency: "PLN",
    description: "Bez kompromisów – nieograniczone możliwości i priorytetowe wsparcie.",
    trial: false,
    featured: false,
    features: [
      "Nieograniczona liczba projektów",
      "Nieograniczona liczba szablonów",
      "Nieograniczona liczba zdjęć 4K",
      "Dostęp do historii i archiwum",
      "Portal klienta (logowanie)",
      "Własne logo i kolory (branding)",
      "Maile systemowe z Twoim wyglądem",
      "Priorytetowe wsparcie (czat)"
    ],
    limits: {
      projectsPerMonth: null,
      templates: null,
      photosPerProject: null,
      photoResolution: "4k",
      branding: true,
      whitelabelEmails: true,
      supportResponseHours: null
    },
    clerkSlug: "premium"
  }
];

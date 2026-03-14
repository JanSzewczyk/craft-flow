export const PLANS = [
  {
    id: "basic" as const,
    name: "Basic",
    price: 79,
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
      photoResolution: "standard" as const,
      branding: false,
      whitelabelEmails: false,
      supportResponseHours: 48
    }
  },
  {
    id: "standard" as const,
    name: "Standard",
    price: 149,
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
      photoResolution: "hd" as const,
      branding: true,
      whitelabelEmails: true,
      supportResponseHours: 24
    }
  },
  {
    id: "premium" as const,
    name: "Premium",
    price: 299,
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
      photoResolution: "4k" as const,
      branding: true,
      whitelabelEmails: true,
      supportResponseHours: null
    }
  }
] as const;

export type Plan = (typeof PLANS)[number];
export type PlanId = Plan["id"];

export const FOOTER_LINKS = {
  produkt: [
    { href: "/features", label: "Funkcje" },
    { href: "/pricing", label: "Cennik" },
    { href: "/client-portal", label: "Portal Klienta" }
  ],
  firma: [
    { href: "/about-us", label: "O nas" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Kontakt" }
  ],
  prawne: [
    { href: "/terms", label: "Regulamin" },
    { href: "/privacy", label: "Polityka Prywatności" },
    { href: "/gdpr", label: "RODO" }
  ]
} as const;

export const SOCIAL_LINKS = [
  { href: "https://facebook.com/craftflow", label: "Facebook", icon: "facebook" as const },
  { href: "https://twitter.com/craftflow", label: "Twitter", icon: "twitter" as const },
  { href: "https://linkedin.com/company/craftflow", label: "LinkedIn", icon: "linkedin" as const }
] as const;

/**
 * Footer links data
 */
export const FOOTER_LINKS = {
  products: [
    { href: "/features", label: "Funkcje" },
    { href: "/pricing", label: "Cennik" },
    { href: "/login", label: "Logowanie" }
  ] as const,
  company: [
    { href: "/about-us", label: "O nas" },
    { href: "/contact", label: "Kontakt" }
  ] as const,
  legal: [
    { href: "/terms", label: "Regulamin" },
    { href: "/privacy", label: "Polityka prywatności" }
  ] as const
} as const;

export type FooterLink = (typeof FOOTER_LINKS)[keyof typeof FOOTER_LINKS][number];

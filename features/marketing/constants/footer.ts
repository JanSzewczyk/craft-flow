/**
 * Footer links data
 */
export const FOOTER_LINKS = {
  produkt: [
    { href: "/features", label: "Funkcje" },
    { href: "/pricing", label: "Cennik" }
  ] as const,
  firma: [
    { href: "/about-us", label: "O nas" },
    { href: "/contact", label: "Kontakt" }
  ] as const,
  prawne: [
    { href: "/terms", label: "Regulamin" },
    { href: "/privacy", label: "Polityka prywatności" }
  ] as const
} as const;

export type FooterLink = (typeof FOOTER_LINKS)[keyof typeof FOOTER_LINKS][number];

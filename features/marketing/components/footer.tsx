import { Separator } from "@szum-tech/design-system";
import Link from "next/link";

import { BrandLogo } from "./brand-logo";

const FOOTER_LINKS = {
  produkt: [
    { href: "/features", label: "Funkcje" },
    { href: "/pricing", label: "Cennik" },
    { href: "/sign-in", label: "Zaloguj się" }
  ],
  firma: [
    { href: "/about-us", label: "O nas" },
    { href: "/contact", label: "Kontakt" }
  ],
  prawne: [
    { href: "/terms", label: "Regulamin" },
    { href: "/privacy", label: "Polityka prywatności" }
  ]
} as const;

const SOCIAL_LINKS = [
  { href: "https://twitter.com/craftflow", label: "X (Twitter)" },
  { href: "https://instagram.com/craftflow", label: "Instagram" },
  { href: "https://linkedin.com/company/craftflow", label: "LinkedIn" }
] as const;

function FooterColumn({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-body-sm text-foreground font-semibold">{title}</p>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-body-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-background border-t">
      <div className="container py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <BrandLogo />
            <p className="text-body-sm text-muted-foreground max-w-[200px]">
              Portal dla rzemieślników. Koniec z telefonami od klientów.
            </p>
            <div className="flex items-center gap-4 pt-1">
              {SOCIAL_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <FooterColumn title="Produkt" links={FOOTER_LINKS.produkt} />
          <FooterColumn title="Firma" links={FOOTER_LINKS.firma} />
          <FooterColumn title="Prawne" links={FOOTER_LINKS.prawne} />
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-body-sm text-muted-foreground">© {year} CraftFlow. Wszelkie prawa zastrzeżone.</p>
          <p className="text-body-xs text-muted-foreground">Zbudowane dla polskich rzemieślników</p>
        </div>
      </div>
    </footer>
  );
}

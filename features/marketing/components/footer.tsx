import { FacebookIcon, LinkedinIcon, TwitterIcon } from "lucide-react";

import { Button, Separator } from "@szum-tech/design-system";
import Link from "next/link";
import { FOOTER_LINKS, SOCIAL_LINKS } from "~/features/marketing/constants";

import { BrandLogo } from "./brand-logo";

const ICONS = {
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  linkedin: LinkedinIcon
} as const;

function FooterColumn({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-body-sm text-foreground font-semibold">{title}</h3>
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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-12">
          {/* Brand column */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <BrandLogo />
            <p className="text-body-sm text-muted-foreground max-w-60">
              Twoja praca, nasza technologia. System stworzony, aby wspierać rzemiosło nowoczesnymi narzędziami.{" "}
            </p>
            {/* Social media icons */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => {
                const Icon = ICONS[social.icon];
                return (
                  <Link
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    <Icon size={20} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Navigation columns */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-3 lg:grid-cols-3">
            <FooterColumn title="PRODUKT" links={FOOTER_LINKS.products} />
            <FooterColumn title="FIRMA" links={FOOTER_LINKS.company} />

            {/* Start now section */}
            <div>
              <h3 className="text-heading-h3 text-foreground mb-6">Zacznij już teraz</h3>
              <p className="text-mute mb-2">Dołącz do setek warsztatów, które już z nami pracują.</p>
              <Button asChild>
                <Link href="/signup">Wypróbuj bez opłat</Link>
              </Button>
              <p className="text-small mt-4">14 dni darmowego testowania. Nie wymagamy karty.</p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom bar with copyright and social icons */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col gap-1">
            <p className="text-body-sm text-muted-foreground">Copyright © {year} CraftFlow</p>
            <p className="text-body-xs text-muted-foreground/80">Stworzone przez rzemieślników dla rzemieślników.</p>
          </div>

          {/* Legals */}
          <div className="flex items-center gap-4">
            {FOOTER_LINKS.legal.map((legal) => {
              return (
                <Link
                  key={legal.href}
                  href={legal.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={legal.label}
                  className="text-body-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {legal.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

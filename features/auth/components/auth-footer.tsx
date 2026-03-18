import Link from "next/link";

import { AUTH_FOOTER_LINKS } from "~/features/auth/constants/auth-constants";

export function AuthFooter() {
  return (
    <footer className="text-muted-foreground flex gap-4 text-xs">
      {AUTH_FOOTER_LINKS.map((link) => (
        <Link key={link.href} href={link.href} className="hover:text-foreground transition-colors">
          {link.label}
        </Link>
      ))}
    </footer>
  );
}

"use client";

import * as React from "react";

import { MenuIcon } from "lucide-react";

import { Button, Header, Separator, Sheet, SheetContent, SheetTrigger } from "@szum-tech/design-system";
import { cn } from "@szum-tech/design-system/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "~/components/ui/theme-toggle";

/**
 * Navigation links for the marketing site.
 */
const NAV_LINKS = [
  { href: "/features", label: "Funkcje" },
  { href: "/", label: "Cennik" },
  { href: "/about", label: "O nas" },
  { href: "/contact", label: "Kontakt" }
] as const;

/**
 * Logo component for CraftFlow.
 */
function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2 transition-transform duration-200 hover:scale-105">
      <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
        <svg className="size-5" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
        </svg>
      </div>
      <span className="text-foreground text-body-xl">CraftFlow</span>
    </Link>
  );
}

/**
 * Desktop navigation links.
 */
function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-body-sm group/link relative transition-all duration-200",
              isActive
                ? "text-primary after:bg-primary after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full"
                : "text-muted-foreground hover:text-primary",
              !isActive &&
                "after:bg-primary after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:transition-all after:duration-300 after:ease-out after:content-[''] hover:group-focus/link:after:w-full"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Mobile navigation menu.
 */
function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <div className="mt-8 flex flex-col gap-6">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-body-lg group/link relative -my-2 py-2 font-medium transition-all duration-200",
                    isActive
                      ? "text-primary bg-primary/5 -mx-4 rounded-md px-4"
                      : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <Separator />
          <div className="flex flex-col gap-3">
            <Button variant="outline" fullWidth asChild>
              <Link href="/pricing" onClick={() => setOpen(false)}>
                Rozpocznij okres próbny
              </Link>
            </Button>
            <Button fullWidth asChild>
              <Link href="/sign-in" onClick={() => setOpen(false)}>
                Zaloguj się
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Action buttons for authenticated/unauthenticated states.
 */
function HeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <>
        <Button variant="outline" size="default" className="hidden sm:flex" asChild>
          <Link href="/pricing">Rozpocznij okres próbny</Link>
        </Button>
        <Button size="default" className="hidden sm:flex" asChild>
          <Link href="/sign-in">Zaloguj się</Link>
        </Button>
      </>

      <MobileNav />
    </div>
  );
}

/**
 * Main header component for the marketing site.
 *
 * Features:
 * - Sticky positioning with backdrop blur
 * - Responsive navigation (desktop + mobile)
 * - Theme toggle
 * - Auth state detection (Clerk placeholders)
 *
 * @example
 * ```tsx
 * <MarketingHeader />
 * ```
 */
export function MarketingHeader() {
  return (
    <Header>
      <div className="flex w-full items-center justify-between">
        <Logo />
        <DesktopNav />
        <div className="flex gap-3">
          <ThemeToggle />
          <Separator orientation="vertical" className="h-auto!" />
          <HeaderActions />
        </div>
      </div>
    </Header>
  );
}

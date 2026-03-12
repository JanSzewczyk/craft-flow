import React from "react";

import { ArrowRight, Menu, Smartphone, Zap } from "lucide-react";

import { Avatar, AvatarFallback, Badge, Button, Card, Separator } from "@szum-tech/design-system";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="flex min-h-screen items-center">
      <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
          {/* Copy */}
          <div className="flex flex-col items-start gap-6">
            <Badge variant="primary">
              <Zap className="size-4" />
              Nowoczesny Warsztat
            </Badge>

            <h1 className="text-display-lg font-poppins text-foreground">
              Zakończ erę ciągłych <span className="text-primary">telefonów</span> od klientów.
            </h1>

            <p className="text-lead max-w-lg">
              CraftFlow to Twój cyfrowy asystent. Ty pracujesz w warsztacie, a Twoi klienci sami sprawdzają postępy
              online w czasie rzeczywistym.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/pricing">Rozpocznij 14-dniowy okres próbny</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/features">
                  Zobacz jak to działa
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <Avatar className="ring-background ring-2" key={i}>
                    <AvatarFallback>{String.fromCharCode(64 + i)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-body-sm text-muted-foreground">
                Dołącz do <span className="text-foreground font-medium">+500 warsztatów</span>
              </span>
            </div>
          </div>

          {/* Smartphone mockup */}
          <div className="relative flex justify-center">
            <Card className="mx-auto w-full max-w-[320px] overflow-hidden rounded-[2.5rem] shadow-2xl">
              {/* Phone frame */}
              <div className="bg-background relative p-4">
                {/* Status bar */}
                <div className="mb-4 flex items-center justify-between">
                  <Menu className="text-muted-foreground h-5 w-5" />
                  <span className="text-body-xs text-muted-foreground">12:30</span>
                  <div className="bg-muted h-5 w-5 rounded-full" />
                </div>

                <Separator className="mb-4" />

                {/* Status card */}
                <div className="bg-muted/30 space-y-4 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm text-foreground font-medium">Status Zlecenia</span>
                    <div className="flex gap-1">
                      <div className="bg-primary h-2 w-2 rounded-full" />
                      <div className="bg-primary h-2 w-2 rounded-full" />
                      <div className="bg-primary h-2 w-2 rounded-full" />
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="bg-muted h-2 w-full rounded-full">
                    <div className="bg-primary h-full w-[75%] rounded-full" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="primary" className="text-body-xs">
                      W TRAKCIE
                    </Badge>
                  </div>

                  <h3 className="text-body-default text-foreground">Naprawa układu hamulcowego</h3>

                  {/* Photo placeholders */}
                  <div className="flex gap-3">
                    <div className="bg-muted/50 flex aspect-square flex-1 items-center justify-center rounded-lg">
                      <Smartphone className="text-muted-foreground h-6 w-6" />
                    </div>
                    <div className="bg-muted/50 flex aspect-square flex-1 items-center justify-center rounded-lg">
                      <Smartphone className="text-muted-foreground h-6 w-6" />
                    </div>
                  </div>

                  {/* Text skeleton lines */}
                  <div className="space-y-2 pt-2">
                    <div className="bg-muted/40 h-2.5 w-full rounded-full" />
                    <div className="bg-muted/40 h-2.5 w-3/4 rounded-full" />
                    <div className="bg-muted/40 h-2.5 w-1/2 rounded-full" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

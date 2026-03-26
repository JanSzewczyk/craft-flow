"use client";

import { useMemo } from "react";

import { ArrowRightIcon, CheckCircle2Icon, CheckIcon, SparklesIcon } from "lucide-react";

import { Badge, Button, Card, CardContent } from "@szum-tech/design-system";
import Link from "next/link";
import { type Plan } from "~/features/billing/constants";
import { type PlanFeatures } from "~/features/onboarding/server/services/step-service";

type OnboardingSuccessProps = {
  plan: Plan;
  features: PlanFeatures;
  companyName: string;
  hasBranding: boolean;
  hasEmail: boolean;
  templateCount: number;
};

const CONFETTI_COLORS = [
  "var(--color-primary)",
  "color-mix(in oklch, var(--color-primary) 50%, transparent)",
  "color-mix(in oklch, var(--color-primary) 80%, white)"
];

export function OnboardingSuccess({
  plan,
  features,
  companyName,
  hasBranding,
  hasEmail,
  templateCount
}: OnboardingSuccessProps) {
  const confetti = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay: `${Math.random() * 3}s`,
        duration: `${2 + Math.random() * 3}s`
      })),
    []
  );

  const steps = [
    { label: "Firma", value: companyName, show: true },
    {
      label: "Branding",
      value: hasBranding ? "Skonfigurowano" : "Pominięto",
      done: hasBranding,
      show: features.branding
    },
    { label: "Szablony", value: `${templateCount} etapów gotowych`, show: true },
    {
      label: "E-mail",
      value: hasEmail ? "Szablon zapisany" : "Pominięto",
      done: hasEmail,
      show: features.whitelabelEmails
    }
  ].filter((s) => s.show);

  return (
    <>
      <style>{`
        @keyframes pop-in {
          0%   { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes confetti-fall {
          0%   { transform: translateY(0) rotate(0deg);      opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-pop-in {
          animation: pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-confetti {
          animation: confetti-fall var(--duration) ease-in-out var(--delay) infinite;
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="animate-confetti absolute top-0 h-3 w-2 rounded-sm opacity-0"
            style={
              {
                left: piece.left,
                backgroundColor: piece.color,
                "--delay": piece.delay,
                "--duration": piece.duration
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-12 py-12">
        {/* Hero */}
        <div className="animate-pop-in flex flex-col items-center gap-6 text-center">
          <div className="relative inline-block">
            <div className="from-primary/30 to-primary-container/30 absolute inset-0 scale-150 animate-pulse rounded-full bg-linear-to-br blur-2xl" />
            <div className="from-primary to-primary-container relative flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br shadow-xl">
              <CheckIcon className="size-16 text-white" strokeWidth={3} />
            </div>
          </div>
          <div>
            <h1 className="text-heading-h1 text-foreground mb-2">Twój warsztat jest gotowy!</h1>
            <p className="text-body-lg text-muted-foreground max-w-md">
              Stworzyliśmy dla Ciebie Projekt Demo, aby pokazać możliwości CraftFlow
            </p>
          </div>
        </div>

        {/* Summary Card */}
        <Card
          className="w-full max-w-4xl overflow-hidden"
          style={
            {
              animation: "pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards",
              opacity: 0
            } as React.CSSProperties
          }
        >
          <CardContent className="grid grid-cols-1 p-0 md:grid-cols-2">
            {/* Left: Plan */}
            <div className="border-border p-8 md:border-r">
              <div className="mb-6 flex items-center gap-2">
                <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Twój Plan</span>
                <Badge variant="secondary">Aktywny</Badge>
              </div>
              <h3 className="text-heading-h2 mb-2">{plan.name}</h3>
              <p className="text-body-sm text-muted-foreground mb-8">
                Wszystkie narzędzia potrzebne do skalowania Twojego warsztatu.
              </p>
              <div className="bg-muted flex items-center gap-4 rounded-xl p-4">
                <div className="bg-background text-primary flex h-10 w-10 items-center justify-center rounded-lg shadow-sm">
                  <SparklesIcon className="size-5" />
                </div>
                <div>
                  <p className="text-body-sm font-semibold">Demo Project Ready</p>
                  <p className="text-muted-foreground text-[12px]">Zasoby, harmonogram i budżet</p>
                </div>
              </div>
            </div>

            {/* Right: Completed Steps */}
            <div className="p-8">
              <span className="text-muted-foreground mb-6 block text-[10px] tracking-widest uppercase">
                Konfiguracja zakończona
              </span>
              <div className="flex flex-col gap-4">
                {steps.map((step) => (
                  <div key={step.label} className="flex items-center gap-3">
                    <CheckCircle2Icon
                      className={`size-5 shrink-0 ${step.done === false ? "text-muted-foreground" : "text-primary"}`}
                    />
                    <div>
                      <p className="text-muted-foreground text-[10px] tracking-widest uppercase">{step.label}</p>
                      <p className="text-body-sm text-foreground font-semibold">{step.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div
          className="flex w-full max-w-sm flex-col gap-3"
          style={
            {
              animation: "pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s forwards",
              opacity: 0
            } as React.CSSProperties
          }
        >
          <Button size="lg" className="h-14 rounded-2xl" asChild>
            <Link href="/app/dashboard">
              Otwórz Dashboard
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/app/settings">Przejdź do konfiguracji warsztatu</Link>
          </Button>
        </div>
      </div>
    </>
  );
}

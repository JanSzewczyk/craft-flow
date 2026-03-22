"use client";

import { ArrowRightIcon, CheckCircle2Icon, SparklesIcon } from "lucide-react";

import { Button, Card, CardContent } from "@szum-tech/design-system";
import Link from "next/link";

type OnboardingSuccessProps = {
  planName: string;
  companyName: string;
  hasBranding: boolean;
  templateCount: number;
};

export function OnboardingSuccess({ planName, companyName, hasBranding, templateCount }: OnboardingSuccessProps) {
  const checks = [
    { label: `Plan ${planName} aktywny`, done: true },
    { label: `Firma: ${companyName}`, done: true },
    { label: "Branding skonfigurowany", done: hasBranding },
    { label: `${templateCount} etapów gotowych`, done: templateCount > 0 },
    { label: "Szablon e-mail zapisany", done: true }
  ];

  return (
    <div className="flex flex-col items-center gap-8 py-12 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-primary/10 rounded-full p-4">
          <SparklesIcon className="text-primary size-12" />
        </div>
        <h1 className="text-heading-h1 text-foreground">Twój warsztat jest gotowy!</h1>
        <p className="text-muted-foreground text-body-lg max-w-md">
          Stworzyliśmy dla Ciebie Demo Projekt, aby pokazać możliwości CraftFlow
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col gap-3 pt-6">
          {checks.map((check) => (
            <div key={check.label} className="flex items-center gap-3">
              <CheckCircle2Icon
                className={`size-5 shrink-0 ${check.done ? "text-primary" : "text-muted-foreground"}`}
              />
              <span className="text-body-sm text-left">{check.label}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <Button size="lg" asChild>
          <Link href="/app/dashboard">
            Otwórz Dashboard
            <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/app/settings">Przejdź do konfiguracji warsztatu</Link>
        </Button>
      </div>
    </div>
  );
}

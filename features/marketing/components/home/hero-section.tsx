import Link from "next/link";
import { Badge, Button, Card, Separator } from "@szum-tech/design-system";
import { CheckCircle2, Circle } from "lucide-react";

type PortalStepProps = {
  icon: React.ReactNode;
  label: string;
  done: boolean;
  active?: boolean;
};

function PortalStep({ icon, label, done, active = false }: PortalStepProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
        active ? "bg-primary/10" : done ? "bg-background/40" : "bg-background/20"
      }`}
    >
      {icon}
      <span
        className={`text-body-sm ${
          active ? "text-foreground font-medium" : done ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
      {active && (
        <Badge variant="primary" className="ml-auto">
          Aktywny
        </Badge>
      )}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
      {/* Radial background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.12),transparent)]"
      />

      <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div className="flex flex-col items-start gap-6">
            <Badge variant="primary">Teraz dostępne &bull; 14 dni za darmo</Badge>

            <h1 className="text-display-lg font-poppins text-foreground">
              Koniec z telefonami od klientów. Daj im portal, nie numer.
            </h1>

            <p className="text-lead max-w-lg">
              Wyślij klientowi link i niech sam sprawdza postęp prac — bez dzwonienia do Ciebie. Ty pracujesz, on śledzi
              projekt w czasie rzeczywistym.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/pricing">Zacznij za darmo →</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/features">Zobacz funkcje</Link>
              </Button>
            </div>
          </div>

          {/* Mockup */}
          <div className="relative">
            <Card className="from-primary/10 to-primary/5 overflow-hidden bg-gradient-to-br p-6 shadow-xl">
              {/* Fake browser chrome */}
              <div className="mb-4 flex items-center gap-2">
                <div className="bg-error/60 h-3 w-3 rounded-full" />
                <div className="bg-warning/60 h-3 w-3 rounded-full" />
                <div className="bg-success/60 h-3 w-3 rounded-full" />
                <div className="bg-background/60 text-body-xs text-muted-foreground ml-3 flex-1 rounded px-3 py-1">
                  craftflow.app/projekt/szafa-na-wymiar
                </div>
              </div>

              <Separator className="mb-5" />

              {/* Portal header */}
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-body-xs text-muted-foreground">Twój projekt</p>
                  <h2 className="text-heading-h3 text-foreground">Szafa na wymiar — Kowalski</h2>
                </div>
                <Badge variant="warning">Projekt w toku</Badge>
              </div>

              {/* Status steps */}
              <div className="flex flex-col gap-3">
                <PortalStep
                  icon={<CheckCircle2 className="text-success h-5 w-5" />}
                  label="Wycena zaakceptowana"
                  done
                />
                <PortalStep icon={<CheckCircle2 className="text-success h-5 w-5" />} label="Materiały zamówione" done />
                <PortalStep
                  icon={<CheckCircle2 className="text-success h-5 w-5" />}
                  label="Produkcja w toku"
                  done
                  active
                />
                <PortalStep
                  icon={<Circle className="text-muted-foreground h-5 w-5" />}
                  label="Montaż u klienta"
                  done={false}
                />
                <PortalStep
                  icon={<Circle className="text-muted-foreground h-5 w-5" />}
                  label="Odbiór końcowy"
                  done={false}
                />
              </div>

              <Separator className="my-5" />

              <p className="text-body-xs text-muted-foreground">
                Ostatnia aktualizacja: dziś, 14:23 &bull; przez Marek Nowak
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

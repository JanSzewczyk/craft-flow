import { type Metadata } from "next";
import { CheckCircle2Icon } from "lucide-react";
import Link from "next/link";

import { Badge, Button, Card, CardContent, CardFooter, CardHeader, Separator } from "@szum-tech/design-system";
import { PLANS } from "~/constants/plans";
import { PricingFAQ } from "~/features/marketing/components";

export const metadata: Metadata = {
  title: "Cennik",
  description:
    "Sprawdź plany CraftFlow – Basic 79 PLN, Standard 149 PLN, Premium 299 PLN. Zacznij z 14-dniowym bezpłatnym okresem próbnym.",
  openGraph: {
    title: "Cennik CraftFlow – Wybierz plan dla swojego warsztatu",
    description: "14 dni Premium za darmo. Bez karty kredytowej.",
    type: "website"
  }
};

export default function PricingPage() {
  return (
    <main>
      {/* Pricing Cards Section */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="text-display-md mb-4">Wybierz plan dla swojego warsztatu</h1>
          <p className="text-lead">
            Każdy nowy użytkownik otrzymuje 14 dni bezpłatnego dostępu do planu Premium — bez karty kredytowej.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const isPopular = plan.id === "standard";

            return (
              <Card key={plan.id} className={isPopular ? "ring-primary relative ring-2" : "relative"}>
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="primary">Najpopularniejszy</Badge>
                  </div>
                )}

                <CardHeader>
                  <h2 className="text-heading-h2">{plan.name}</h2>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-display-sm">{plan.price}</span>
                    <span className="text-body-sm text-muted-foreground">PLN / miesiąc</span>
                  </div>
                  <p className="text-body-sm text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>

                <CardContent>
                  <Separator className="mb-6" />
                  <ul className="space-y-3" role="list" aria-label={`Funkcje planu ${plan.name}`}>
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2Icon className="text-success mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        <span className="text-body-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button asChild fullWidth variant={isPopular ? "default" : "outline"}>
                    <Link href={`/sign-up?plan=${plan.id}`}>Zacznij okres próbny</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* FAQ Section */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-display-sm">Najczęściej zadawane pytania</h2>
        </div>

        <div className="mx-auto max-w-3xl">
          <PricingFAQ />
        </div>
      </section>
    </main>
  );
}

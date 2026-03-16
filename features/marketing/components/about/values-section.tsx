import * as React from "react";

import { Clock, Eye, Heart, Wrench } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@szum-tech/design-system";

const VALUES = [
  {
    icon: <Wrench className="size-6" />,
    name: "Prostota",
    description: "Tworzymy narzędzia, których obsługa jest intuicyjna i nie wymaga szkolenia."
  },
  {
    icon: <Clock className="size-6" />,
    name: "Szacunek do czasu",
    description: "Szanujemy Twój czas. Każda funkcja ma go oszczędzać, a nie marnować."
  },
  {
    icon: <Eye className="size-6" />,
    name: "Transparentność",
    description: "Jasne zasady i przejrzysty proces to fundament zaufania naszych klientów."
  },
  {
    icon: <Heart className="size-6" />,
    name: "Pasja",
    description: "Sami jesteśmy twórcami. Rozumiemy radość z dobrze wykonanej pracy."
  }
] as const;

type ValueCardProps = {
  icon: React.ReactNode;
  name: string;
  description: string;
};

function ValueCard({ icon, name, description }: ValueCardProps) {
  return (
    <Card className="hover:border-primary transition hover:scale-110">
      <CardHeader>
        <div
          className="bg-primary/10 text-primary mb-4 flex size-12 items-center justify-center rounded"
          aria-hidden="true"
        >
          {icon}
        </div>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export function ValuesSection() {
  return (
    <section className="container py-24">
      <div className="mb-16 text-center">
        <h2 className="text-display-sm">Nasze Wartości</h2>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((value) => (
          <ValueCard key={value.name} {...value} />
        ))}
      </div>
    </section>
  );
}

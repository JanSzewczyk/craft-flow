import { Clock, Eye, Heart, Zap } from "lucide-react";

const VALUES = [
  {
    icon: <Clock className="h-6 w-6" />,
    name: "Szanujemy Twój czas",
    description: "Każda funkcja CraftFlow jest zaprojektowana, żeby zaoszczędzić minuty. Twój czas to Twoje pieniądze."
  },
  {
    icon: <Eye className="h-6 w-6" />,
    name: "Transparentność",
    description: "Klient widzi dokładnie tyle, ile chcesz pokazać. Żadnych niespodzianek po obu stronach."
  },
  {
    icon: <Zap className="h-6 w-6" />,
    name: "Prostota",
    description: "Onboarding zajmuje 5 minut. Jeśli coś wymaga instrukcji obsługi — przeprojektowujemy to."
  },
  {
    icon: <Heart className="h-6 w-6" />,
    name: "Wsparcie rzemieślnika",
    description: "Budujemy dla ludzi, którzy tworzą rzeczy własnymi rękami. To dla nas coś więcej niż SaaS."
  }
];

type ValueCardProps = {
  icon: React.ReactNode;
  name: string;
  description: string;
};

function ValueCard({ icon, name, description }: ValueCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <div
        className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl"
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-heading-h3 text-foreground">{name}</h3>
        <p className="text-body-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function ValuesSection() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-display-sm font-poppins text-foreground">Co nas napędza</h2>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4">
          {VALUES.map((value) => (
            <ValueCard key={value.name} {...value} />
          ))}
        </div>
      </div>
    </section>
  );
}

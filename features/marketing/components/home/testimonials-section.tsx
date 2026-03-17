import { Star } from "lucide-react";

import { Avatar, AvatarFallback, Card, CardHeader } from "@szum-tech/design-system";
import { STARS, TESTIMONIALS } from "~/features/marketing/constants";

type TestimonialCardProps = {
  quote: string;
  name: string;
  trade: string;
  city: string;
  initials: string;
};

function StarRating() {
  return (
    <div className="flex gap-0.5" aria-label="Ocena 5 na 5 gwiazdek">
      {STARS.map((i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
      ))}
    </div>
  );
}

function TestimonialCard({ quote, name, trade, city, initials }: TestimonialCardProps) {
  return (
    <Card>
      <CardHeader className="gap-6">
        <StarRating />
        <blockquote className="text-blockquote">{quote}</blockquote>
        <div className="mt-auto flex items-center gap-3">
          <Avatar className="bg-primary/10 size-10">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-body-sm text-foreground font-semibold">{name}</p>
            <p className="text-body-xs text-muted-foreground">
              {trade} &bull; {city}
            </p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-display-sm text-foreground">Zaufali nam rzemieślnicy z całej Polski</h2>
          <p className="text-lead mx-auto mt-4 max-w-xl">Prawdziwe opinie od prawdziwych fachowców.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.initials} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}

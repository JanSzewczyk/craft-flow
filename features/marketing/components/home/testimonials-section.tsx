import { Card } from "@szum-tech/design-system";
import { Star } from "lucide-react";

const STARS = [0, 1, 2, 3, 4] as const;

const TESTIMONIALS = [
  {
    quote:
      "Odkąd korzystam z CraftFlow, klienci przestali dzwonić z pytaniem 'kiedy będzie gotowe'. Portal robi to za mnie — klient wchodzi, sprawdza, jest spokojny. Oszczędzam co najmniej godzinę telefonów dziennie.",
    name: "Marek Wiśniewski",
    trade: "Stolarz",
    city: "Wrocław",
    initials: "MW"
  },
  {
    quote:
      "Wygląda to bardzo profesjonalnie — klient dostaje linka do swojego projektu i widzi wszystko na bieżąco. Miałem już kilka sytuacji, gdzie klient polecił mnie dalej właśnie przez ten portal. To najlepszy marketing, jaki mogłem sobie zrobić.",
    name: "Piotr Zając",
    trade: "Elektryk",
    city: "Kraków",
    initials: "PZ"
  },
  {
    quote:
      "Wcześniej gubiłem zdjęcia po różnych folderach na telefonie. Teraz wszystko jest w jednym miejscu, klient widzi postęp, a ja mam porządek w dokumentacji. CraftFlow to coś, czego szukałem od lat.",
    name: "Tomasz Nowak",
    trade: "Glazurnik",
    city: "Poznań",
    initials: "TN"
  }
] as const;

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
    <Card className="flex flex-col gap-5 p-6">
      <StarRating />
      <blockquote className="text-body-default text-foreground">&ldquo;{quote}&rdquo;</blockquote>
      <div className="mt-auto flex items-center gap-3">
        <div
          className="bg-primary/10 text-body-sm text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold"
          aria-hidden="true"
        >
          {initials}
        </div>
        <div>
          <p className="text-body-sm text-foreground font-semibold">{name}</p>
          <p className="text-body-xs text-muted-foreground">
            {trade} &bull; {city}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-display-sm font-poppins text-foreground">Zaufali nam rzemieślnicy z całej Polski</h2>
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

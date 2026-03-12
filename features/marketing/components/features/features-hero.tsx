import { Badge } from "@szum-tech/design-system";

export function FeaturesHero() {
  return (
    <section className="bg-muted/30 py-20 sm:py-24">
      <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
        <Badge variant="primary" className="mb-4">
          Funkcje
        </Badge>
        <h1 className="text-display-md font-poppins text-foreground mx-auto mt-4 max-w-3xl">
          Wszystko, czego potrzebujesz do zarządzania zleceniami
        </h1>
        <p className="text-lead mx-auto mt-6 max-w-2xl">
          Koniec z telefonami od klientów i chaosem w dokumentacji — CraftFlow to jedno narzędzie, które ogarnia cały
          przepływ Twojej pracy.
        </p>
      </div>
    </section>
  );
}

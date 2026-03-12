import { Hammer } from "lucide-react";

import { Badge, Card } from "@szum-tech/design-system";

export function HistorySection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text */}
          <div className="flex flex-col gap-6">
            <Badge variant="outline">Nasza historia</Badge>

            <h1 className="text-display-md font-poppins text-foreground">
              Zbudowane przez rzemieślnika, dla rzemieślników
            </h1>

            <p className="text-body-lg text-muted-foreground">
              Kamil, stolarz z Wrocławia, przez lata tracił godziny dziennie na telefony od klientów pytających o status
              mebli. Szukał prostego narzędzia — nie znalazł. Postanowił je zbudować.
            </p>

            <p className="text-body-lg text-muted-foreground">
              CraftFlow powstało z jednym celem: dać rzemieślnikom narzędzie tak proste, jak SMS, ale tak profesjonalne
              jak dedykowana aplikacja korporacyjna. Bez zbędnych funkcji. Bez skomplikowanej konfiguracji.
            </p>

            <div className="border-primary border-l-4 pl-4">
              <blockquote className="text-body-lg text-foreground italic">
                „Chciałem, żeby mój klient wiedział, co się dzieje z jego szafą — bez dzwonienia do mnie co dwa dni."
              </blockquote>
              <p className="text-body-sm text-muted-foreground mt-2">— Kamil, założyciel CraftFlow</p>
            </div>
          </div>

          {/* Right: Decorative */}
          <div className="relative flex items-center justify-center">
            <div className="bg-primary/10 to-primary/5 flex aspect-square w-full max-w-md items-center justify-center rounded-2xl bg-gradient-to-br">
              <Hammer className="text-primary/30" size={96} aria-hidden="true" />
            </div>

            {/* Floating stat card */}
            <Card className="absolute right-6 bottom-6 px-5 py-4 shadow-lg sm:right-8 sm:bottom-8">
              <p className="text-heading-h3 text-foreground">1 247 rzemieślników</p>
              <p className="text-body-sm text-muted-foreground">korzysta z CraftFlow</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

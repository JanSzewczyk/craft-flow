import { FolderOpen, PhoneOff, Star } from "lucide-react";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">{icon}</div>
      <div className="flex flex-col gap-2">
        <h3 className="text-heading-h3 text-foreground">{title}</h3>
        <p className="text-body-default text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function WhyCraftFlowSection() {
  return (
    <section className="bg-muted/30 py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-display-sm font-poppins text-foreground">Dlaczego CraftFlow?</h2>
          <p className="text-lead mx-auto mt-4 max-w-2xl">
            Trzy problemy każdego rzemieślnika — jedno narzędzie, które je rozwiązuje.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-3 sm:gap-12">
          <FeatureCard
            icon={<PhoneOff className="h-6 w-6" />}
            title="Klient ciągle dzwoni"
            description="Twój klient nie wie, co dzieje się z jego zleceniem. Zamiast kolejnego telefonu, wyślij mu link do portalu z aktualnym statusem. Spokój po obu stronach."
          />
          <FeatureCard
            icon={<Star className="h-6 w-6" />}
            title="Brak profesjonalnego wizerunku"
            description="Rzemieślnik z własnym portalem klienta wygląda jak firma, a nie hobby. Buduj zaufanie od pierwszego kontaktu i wyróżnij się na tle konkurencji."
          />
          <FeatureCard
            icon={<FolderOpen className="h-6 w-6" />}
            title="Chaos z dokumentacją"
            description="Zdjęcia na telefonie, oferty w mailach, notatki na kartce. CraftFlow to jedno miejsce na wszystko — historia projektu zawsze pod ręką."
          />
        </div>
      </div>
    </section>
  );
}

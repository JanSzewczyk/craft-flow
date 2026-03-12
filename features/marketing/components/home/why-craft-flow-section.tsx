import { FolderOpen, PhoneOff, Verified } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@szum-tech/design-system";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="transition-all hover:-translate-y-2 hover:shadow-xl">
      <CardHeader>
        <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded">{icon}</div>
        <CardTitle className="text-heading-h3">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export function WhyCraftFlowSection() {
  return (
    <section className="bg-muted/30 py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-display-sm text-foreground">Dlaczego CraftFlow?</h2>
          {/* Decorative underline */}
          <div className="bg-primary mx-auto mt-4 h-1.5 w-20 rounded-full" />
          <p className="text-lead mx-auto mt-6 max-w-2xl">
            Stworzyliśmy system, który oszczędza Twój czas i buduje zaufanie Twoich klientów od pierwszego dnia.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3 sm:gap-12">
          <FeatureCard
            icon={<PhoneOff className="size-6" />}
            title="Mniej telefonów"
            description="Klienci sami sprawdzają status zlecenia online. Otrzymują powiadomienia o każdej zmianie statusu bez Twojej interwencji."
          />
          <FeatureCard
            icon={<Verified className="size-6" />}
            title="Profesjonalny wizerunek"
            description="Buduj zaufanie dzięki nowoczesnemu systemowi komunikacji. Twoja firma wygląda na bardziej zorganizowaną i godną zaufania."
          />
          <FeatureCard
            icon={<FolderOpen className="size-6" />}
            title="Porządek w plikach"
            description="Wszystkie zdjęcia z naprawy, kosztorysy i dokumenty w jednym, bezpiecznym miejscu. Nigdy więcej szukania faktur w mailach."
          />
        </div>
      </div>
    </section>
  );
}

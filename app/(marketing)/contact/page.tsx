import { Clock, Mail, MapPin } from "lucide-react";
import { type Metadata } from "next";

import { Badge, Card, CardContent, Separator } from "@szum-tech/design-system";
import { ContactForm } from "~/features/contact/components/contact-form";
import { ContactItem, FaqItem } from "~/features/marketing/components";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Masz pytanie do CraftFlow? Napisz do nas – odpowiemy w ciągu 24 godzin.",
  openGraph: {
    title: "Kontakt – CraftFlow",
    description: "Skontaktuj się z zespołem CraftFlow.",
    type: "website"
  }
};

export default function ContactPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <Badge variant="outline">Kontakt</Badge>
            <h1 className="text-display-md font-poppins text-foreground">Skontaktuj się z nami</h1>
            <p className="text-lead mx-auto max-w-xl">Masz pytanie? Chętnie odpowiemy.</p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Left: Contact info + Mini FAQ */}
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-6">
                <h2 className="text-heading-h2 text-foreground">Dane kontaktowe</h2>
                <div className="flex flex-col gap-5">
                  <ContactItem icon={<Mail className="size-5" />} label="E-mail" value="kontakt@craftflow.pl" />
                  <ContactItem
                    icon={<Clock className="size-5" />}
                    label="Godziny wsparcia"
                    value="Pon–Pt, 9:00–17:00"
                  />
                  <ContactItem icon={<MapPin className="size-5" />} label="Siedziba" value="Wrocław, Polska" />
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-5">
                <h3 className="text-heading-h3 text-foreground">Zanim napiszesz...</h3>
                <dl className="flex flex-col gap-5">
                  <FaqItem
                    question="Jak długo trwa wdrożenie?"
                    answer="Rejestracja i konfiguracja zajmuje około 10 minut. Onboarding prowadzi Cię krok po kroku."
                  />
                  <FaqItem
                    question="Czy mogę przetestować przed zakupem?"
                    answer="Tak — 14 dni Premium za darmo, bez karty kredytowej."
                  />
                  <FaqItem
                    question="Mam problem techniczny — co robię?"
                    answer="Napisz do nas z opisem problemu. Reagujemy w ciągu 24 godzin na dni robocze."
                  />
                </dl>
              </div>
            </div>

            {/* Right: Contact form */}
            <div>
              <Card>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

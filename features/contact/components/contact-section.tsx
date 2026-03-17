import { Clock, Mail } from "lucide-react";

import { Card, CardContent, Separator } from "@szum-tech/design-system";
import { ContactForm } from "./contact-form";
import { ContactFAQ } from "./contact-faq";

export function ContactSection() {
  return (
    <section className="container py-16">
      <div className="grid gap-16 lg:grid-cols-2">
        {/* Left: FAQ + contact info */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <h2 className="text-heading-h2 text-foreground">Porozmawiajmy o Twoim warsztacie.</h2>
            <p className="text-lead text-muted-foreground">
              Jesteśmy tutaj, aby pomóc Ci zoptymalizować Twój biznes i usprawnić codzienną pracę w warsztacie. Wyślij
              nam wiadomość, a nasz zespół odpowie w ciągu 24 godzin.
            </p>
            <ContactFAQ />
          </div>

          <Separator />

          <div className="flex flex-col gap-5">
            <h3 className="text-heading-h3 text-foreground">Informacje kontaktowe</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Mail className="text-muted-foreground mt-0.5 size-5" />
                <div>
                  <p className="text-body-sm text-foreground font-medium">E-mail</p>
                  <p className="text-body-sm text-muted-foreground">kontakt@craftflow.pl</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-muted-foreground mt-0.5 size-5" />
                <div>
                  <p className="text-body-sm text-foreground font-medium">Godziny wsparcia</p>
                  <p className="text-body-sm text-muted-foreground">Pon–Pt, 9:00–17:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact form */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

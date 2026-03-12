import { type Metadata } from "next";

import {
  BottomCtaSection,
  CrmIllustration,
  EmailIllustration,
  FeatureSection,
  FeaturesHero,
  PortalIllustration,
  TemplatesIllustration,
  TimelineIllustration
} from "~/features/marketing/components";

export const metadata: Metadata = {
  title: "Funkcje",
  description:
    "Oś czasu projektu, portal klienta, CRM, szablony etapów i automatyczne maile – wszystko w jednym narzędziu dla rzemieślników.",
  openGraph: {
    title: "Funkcje CraftFlow",
    description: "Wszystko, czego potrzebujesz do zarządzania zleceniami.",
    type: "website"
  }
};

export default function FeaturesPage() {
  return (
    <>
      <FeaturesHero />

      {/* Feature 1: Oś czasu projektu — illustration left, text right */}
      <FeatureSection
        illustrationFirst
        badge="Przejrzystość"
        heading="Klient widzi każdy krok — bez pytania"
        description="Każde zlecenie ma swoją oś czasu z etapami. Klient dostaje link i sam sprawdza postęp w czasie rzeczywistym. Koniec z telefonami &ldquo;kiedy będzie gotowe?&rdquo;"
        bullets={[
          { text: "Etapy tworzone z Twoich szablonów" },
          { text: "Aktualizacja statusu jednym kliknięciem" },
          { text: "Klient widzi tylko to, co chcesz pokazać" }
        ]}
        illustration={<TimelineIllustration />}
      />

      <div className="bg-muted/30">
        {/* Feature 2: Portal klienta — text left, illustration right */}
        <FeatureSection
          illustrationFirst={false}
          badge="Profesjonalizm"
          heading="Własny portal dla każdego zlecenia"
          description="Każdy projekt dostaje unikalny link. Klient otwiera go w przeglądarce — bez instalowania aplikacji, bez zakładania konta. Twoje logo, Twoje kolory."
          bullets={[
            { text: "Dostęp przez link — zero rejestracji" },
            { text: "Branding z Twoim logo i kolorami" },
            { text: "Opcjonalne logowanie dla stałych klientów" }
          ]}
          illustration={<PortalIllustration />}
        />
      </div>

      {/* Feature 3: CRM — illustration left, text right */}
      <FeatureSection
        illustrationFirst
        badge="Organizacja"
        heading="Wszyscy klienci w jednym miejscu"
        description="Kartoteka klientów z historią wszystkich zleceń. Numer telefonu, e-mail, notatki — zawsze pod ręką. Nigdy więcej szukania w kontaktach telefonu."
        bullets={[
          { text: "Historia zleceń każdego klienta" },
          { text: "Szybki podgląd statusu aktywnych projektów" },
          { text: "Eksport danych w dowolnym momencie" }
        ]}
        illustration={<CrmIllustration />}
      />

      <div className="bg-muted/30">
        {/* Feature 4: Szablony — text left, illustration right */}
        <FeatureSection
          illustrationFirst={false}
          badge="Efektywność"
          heading="Twórz nowe zlecenia w 30 sekund"
          description="Zapisz swoje standardowe etapy pracy jako szablon. Przy każdym nowym zleceniu wybierz szablon i gotowe — pełna oś czasu w kilku kliknięciach."
          bullets={[
            { text: "Nieograniczona liczba szablonów (Premium)" },
            { text: "Personalizacja po wybraniu szablonu" },
            { text: "Różne szablony dla różnych branż" }
          ]}
          illustration={<TemplatesIllustration />}
        />
      </div>

      {/* Feature 5: Maile automatyczne — illustration left, text right */}
      <FeatureSection
        illustrationFirst
        badge="Komunikacja"
        heading="Klient zawsze wie, co się dzieje"
        description="Przy każdej zmianie statusu projektu klient dostaje e-mail z aktualizacją. Możesz dostosować treść wiadomości. Na planie Standard i Premium — z Twoim logo."
        bullets={[
          { text: "Automatyczny e-mail przy publikacji projektu" },
          { text: "Powiadomienie przy zakończeniu etapu" },
          { text: "White-label na planach Standard i Premium" }
        ]}
        illustration={<EmailIllustration />}
      />

      <BottomCtaSection
        heading="Gotowy zobaczyć CraftFlow w akcji?"
        ctaLabel="Zacznij 14-dniowy okres próbny"
        ctaHref="/pricing"
        note="Bez karty kredytowej • Anuluj w dowolnym momencie"
      />
    </>
  );
}

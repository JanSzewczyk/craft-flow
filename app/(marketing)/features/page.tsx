import { type Metadata } from "next";

import {
  CrmDashboardIllustration,
  EmailIllustration,
  FeatureSection,
  FeaturesHero,
  SmartLinksIllustration,
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

      {/* Feature 1: Oś Czasu Projektu - TEXT LEFT, VISUAL RIGHT */}
      <FeatureSection
        heading="Oś Czasu Projektu. Zawsze wiesz, co dalej."
        bullets={[
          { text: "Śledź każdy etap zlecenia — od wyceny po odbiór. Nigdy nie zgub wątku w trakcie realizacji." },
          { text: "Klient widzi postępy w czasie rzeczywistym, więc sam nie musi dzwonić z pytaniem «co słychać?»." },
          { text: "Koniec z kartkami i tabelkami w Excelu — wszystkie kamienie milowe w jednym miejscu." }
        ]}
        ctaLabel="Wypróbuj za darmo"
        layout="normal"
        illustration={<TimelineIllustration />}
      />

      {/* Feature 2: Portal Klienta - VISUAL LEFT, TEXT RIGHT */}
      <FeatureSection
        heading="Portal Klienta. Profesjonalny wygląd, zero wysiłku."
        bullets={[
          { text: "Udostępnij klientowi unikalny link — bez instalowania aplikacji, bez zakładania konta." },
          { text: "Klient widzi aktualny status projektu na żywo i czuje się zaopiekowany przez cały czas." },
          { text: "Twoje zlecenia wyglądają profesjonalnie — budujesz zaufanie i dostajesz więcej poleceń." }
        ]}
        layout="reversed"
        illustration={<SmartLinksIllustration />}
      />

      {/* Feature 3: Baza CRM - TEXT LEFT, VISUAL RIGHT */}
      <FeatureSection
        heading="CRM dla Rzemieślnika. Wszyscy klienci w jednym miejscu."
        bullets={[
          { text: "Pełna lista kontaktów z numerami telefonów, mailami i historią zleceń — zawsze pod ręką." },
          { text: "Sprawdź w sekundę, co robiłeś dla danego klienta rok temu i ile na tym zarobiłeś." },
          { text: "Szybkie wyszukiwanie po nazwisku lub typie usługi — znajdziesz każde zlecenie błyskawicznie." }
        ]}
        ctaLabel="Zobacz więcej"
        layout="normal"
        illustration={<CrmDashboardIllustration />}
      />

      {/* Feature 4: Szablony Etapów - VISUAL LEFT, TEXT RIGHT */}
      <FeatureSection
        heading="Szablony Etapów. Zacznij nowe zlecenie w 30 sekund."
        bullets={[
          { text: "Gotowe szablony dla stolarza, elektryka, glazurnika i wielu innych branż — wybierz i ruszaj." },
          { text: "Dostosujesz każdy szablon do własnych potrzeb i zapiszesz go na kolejne zlecenia." },
          { text: "Oszczędzasz godziny konfiguracji przy każdym nowym projekcie — skupiasz się na robocie." }
        ]}
        layout="reversed"
        illustration={<TemplatesIllustration />}
      />

      {/* Feature 5: Powiadomienia E-mail - TEXT LEFT, VISUAL RIGHT */}
      <FeatureSection
        heading="Automatyczne Maile. Klient zawsze na bieżąco."
        bullets={[
          { text: "Gdy etap zlecenia się zmienia, klient dostaje maila automatycznie — Ty nie musisz pamiętać." },
          { text: "Profesjonalne szablony wiadomości — wyglądasz jak duża firma, nawet działając solo." },
          { text: "Zero ręcznego pisania i dzwonienia — CraftFlow komunikuje się z klientem za Ciebie." }
        ]}
        ctaLabel="Wypróbuj za darmo"
        layout="normal"
        illustration={<EmailIllustration />}
      />
    </>
  );
}

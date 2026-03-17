import * as React from "react";

import { CreditCardIcon, FileTextIcon, GavelIcon, InfoIcon, SettingsIcon, ShieldIcon, UserIcon } from "lucide-react";

import {
  LegalBreadcrumbs,
  LegalCallout,
  LegalPageHeader,
  LegalSection,
  LegalSidebar,
  type LegalSidebarSection
} from "~/features/marketing/components";

const SECTIONS: readonly LegalSidebarSection[] = [
  {
    id: "postanowienia-ogolne",
    number: 1,
    title: "Postanowienia ogólne",
    icon: <FileTextIcon className="size-4" />
  },
  {
    id: "definicje",
    number: 2,
    title: "Definicje",
    icon: <InfoIcon className="size-4" />
  },
  {
    id: "rejestracja-i-konto",
    number: 3,
    title: "Rejestracja i konto",
    icon: <UserIcon className="size-4" />
  },
  {
    id: "subskrypcja-i-platnosci",
    number: 4,
    title: "Subskrypcja i płatności",
    icon: <CreditCardIcon className="size-4" />
  },
  {
    id: "prawa-i-obowiazki",
    number: 5,
    title: "Prawa i obowiązki Użytkownika",
    icon: <ShieldIcon className="size-4" />
  },
  {
    id: "ograniczenie-odpowiedzialnosci",
    number: 6,
    title: "Ograniczenie odpowiedzialności",
    icon: <GavelIcon className="size-4" />
  },
  {
    id: "postanowienia-koncowe",
    number: 7,
    title: "Postanowienia końcowe",
    icon: <SettingsIcon className="size-4" />
  }
];

export default function TermsPage() {
  return (
    <div className="bg-muted/30 py-16">
      <div className="container">
        <LegalBreadcrumbs label="Regulamin" />
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-12">
          <LegalSidebar sections={SECTIONS} helpEmail="legal@craftflow.com" />
          <article className="min-w-0 flex-1">
            <LegalPageHeader title="Regulamin usługi CraftFlow" lastUpdated="Ostatnia aktualizacja: marzec 2026" />

            <LegalSection id="postanowienia-ogolne" number={1} title="Postanowienia ogólne">
              <p className="text-body-default text-muted-foreground mb-4">
                Niniejszy Regulamin określa zasady korzystania z usługi CraftFlow — internetowej platformy zarządzania
                projektami i relacjami z klientami, dedykowanej rzemieślnikom i małym warsztatom.
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                Właścicielem i operatorem serwisu CraftFlow jest CraftFlow sp. z o.o. z siedzibą we Wrocławiu, wpisana
                do rejestru przedsiębiorców Krajowego Rejestru Sądowego, NIP: 000-000-00-00 (dalej:
                &bdquo;Operator&rdquo;).
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                Korzystanie z Usługi, w tym rejestracja konta, oznacza zapoznanie się z treścią niniejszego Regulaminu
                oraz bezwarunkową akceptację wszystkich jego postanowień. Jeżeli nie akceptujesz Regulaminu, prosimy o
                zaprzestanie korzystania z Usługi.
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                Regulamin jest dostępny bezpłatnie na stronie internetowej CraftFlow w formie umożliwiającej jego
                pobranie, utrwalenie i wydrukowanie.
              </p>
            </LegalSection>

            <LegalSection id="definicje" number={2} title="Definicje">
              <p className="text-body-default text-muted-foreground mb-4">
                Na potrzeby niniejszego Regulaminu przyjmuje się następujące definicje:
              </p>
              <ul className="text-body-default text-muted-foreground mb-4 list-inside list-disc space-y-1">
                <li>
                  <strong className="text-foreground">Usługa</strong> — platforma CraftFlow dostępna pod adresem
                  craftflow.pl, umożliwiająca zarządzanie projektami, zleceniami i komunikacją z klientami.
                </li>
                <li>
                  <strong className="text-foreground">Użytkownik / Wykonawca</strong> — osoba fizyczna prowadząca
                  działalność gospodarczą lub osoba prawna, która zarejestrowała konto w serwisie i korzysta z Usługi w
                  celu prowadzenia swojego warsztatu lub działalności rzemieślniczej.
                </li>
                <li>
                  <strong className="text-foreground">Klient</strong> — osoba fizyczna lub prawna, której dane zostały
                  wprowadzone do Usługi przez Użytkownika jako odbiorca wykonywanych przez niego zleceń.
                </li>
                <li>
                  <strong className="text-foreground">Subskrypcja</strong> — odpłatny dostęp do Usługi w ramach
                  wybranego Planu, odnawiany automatycznie w cyklach miesięcznych.
                </li>
                <li>
                  <strong className="text-foreground">Plan</strong> — wariant Subskrypcji określający zakres dostępnych
                  funkcji oraz limity (Basic, Standard, Premium).
                </li>
                <li>
                  <strong className="text-foreground">Panel Zarządzania</strong> — interfejs graficzny dostępny po
                  zalogowaniu, umożliwiający konfigurację konta, zarządzanie projektami i przeglądanie danych.
                </li>
              </ul>
            </LegalSection>

            <LegalSection id="rejestracja-i-konto" number={3} title="Rejestracja i konto">
              <p className="text-body-default text-muted-foreground mb-4">
                Rejestracja w Usłudze wymaga podania aktywnego adresu e-mail oraz utworzenia hasła zgodnego z
                wymaganiami bezpieczeństwa. Podanie nieprawdziwych danych jest zabronione i może skutkować usunięciem
                konta.
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                Użytkownik jest wyłącznie odpowiedzialny za bezpieczeństwo swoich danych logowania, w tym za utrzymanie
                hasła w poufności. W przypadku podejrzenia nieautoryzowanego dostępu do konta Użytkownik zobowiązany
                jest niezwłocznie poinformować Operatora pod adresem support@craftflow.pl.
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                Dopuszczalne jest posiadanie wyłącznie jednego konta przypisanego do jednej osoby fizycznej lub jednej
                firmy. Tworzenie kont przez boty, skrypty lub w sposób zautomatyzowany jest zabronione.
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                Operator zastrzega sobie prawo do weryfikacji tożsamości Użytkownika oraz do zawieszenia lub usunięcia
                konta w przypadku naruszenia niniejszego Regulaminu.
              </p>
            </LegalSection>

            <LegalSection id="subskrypcja-i-platnosci" number={4} title="Subskrypcja i płatności">
              <p className="text-body-default text-muted-foreground mb-4">
                Usługa dostępna jest w trzech planach subskrypcyjnych: Basic, Standard oraz Premium, różniących się
                zakresem funkcjonalności i limitami projektów oraz klientów. Aktualne ceny i zakresy planów dostępne są
                na stronie craftflow.pl/pricing.
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                Rozliczenie odbywa się miesięcznie z góry, w dniu pierwszej płatności lub rocznicy subskrypcji. Do
                realizacji płatności Operator korzysta z zewnętrznego procesora płatności Stripe. Operator nie
                przechowuje danych kart płatniczych.
              </p>
              <LegalCallout>
                <p className="text-body-default text-muted-foreground">
                  Nowi Użytkownicy mogą skorzystać z{" "}
                  <strong className="text-foreground">14-dniowego okresu próbnego</strong> Planu Basic bez podawania
                  danych karty płatniczej. Po upływie okresu próbnego konto przechodzi automatycznie na Plan Basic lub
                  na inny plan płatny.
                </p>
              </LegalCallout>
              <p className="text-body-default text-muted-foreground mt-4 mb-4">
                Anulowanie Subskrypcji jest możliwe w dowolnym momencie z poziomu Panelu Zarządzania. Anulowanie
                wywołuje skutek na koniec bieżącego okresu rozliczeniowego — Użytkownik zachowuje dostęp do opłaconych
                funkcji do końca opłaconego okresu. Operator nie zwraca opłat proporcjonalnych za niewykorzystany czas.
              </p>
            </LegalSection>

            <LegalSection id="prawa-i-obowiazki" number={5} title="Prawa i obowiązki Użytkownika">
              <p className="text-body-default text-muted-foreground mb-4">
                Użytkownik zobowiązuje się do korzystania z Usługi wyłącznie w celach zgodnych z obowiązującym prawem,
                niniejszym Regulaminem oraz dobrymi obyczajami.
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                W szczególności Użytkownikowi zabrania się:
              </p>
              <ul className="text-body-default text-muted-foreground mb-4 list-inside list-disc space-y-1">
                <li>używania Usługi do celów niezgodnych z prawem polskim lub prawem Unii Europejskiej;</li>
                <li>udostępniania danych logowania osobom trzecim;</li>
                <li>
                  wprowadzania do Usługi treści naruszających prawa osób trzecich, w tym danych osobowych bez podstawy
                  prawnej;
                </li>
                <li>podejmowania działań mających na celu zakłócenie działania Usługi lub infrastruktury Operatora;</li>
                <li>odsprzedaży, sublicencjonowania lub innego komercyjnego udostępniania dostępu do Usługi.</li>
              </ul>
              <p className="text-body-default text-muted-foreground mb-4">
                Użytkownik ponosi pełną odpowiedzialność za treści i dane wprowadzane do Usługi, w tym za zgodność ich
                przetwarzania z przepisami o ochronie danych osobowych (RODO) w stosunku do swoich Klientów.
              </p>
            </LegalSection>

            <LegalSection id="ograniczenie-odpowiedzialnosci" number={6} title="Ograniczenie odpowiedzialności">
              <p className="text-body-default text-muted-foreground mb-4">
                Usługa świadczona jest w stanie &bdquo;takim, jakim jest&rdquo; (ang. <em>as is</em>) i &bdquo;w miarę
                dostępności&rdquo; (ang. <em>as available</em>). Operator dokłada wszelkich starań, aby Usługa była
                dostępna przez całą dobę, jednak nie gwarantuje nieprzerwanego działania serwisu.
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                Operator nie ponosi odpowiedzialności za przerwy techniczne wynikające z konserwacji infrastruktury,
                awarii zewnętrznych dostawców usług (hostingu, baz danych, procesorów płatności) ani za działania siły
                wyższej.
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                W najszerszym zakresie dopuszczalnym przez obowiązujące prawo łączna odpowiedzialność Operatora wobec
                Użytkownika z tytułu wszelkich roszczeń związanych z Usługą ograniczona jest do wartości opłat
                uiszczonych przez Użytkownika w ciągu ostatnich trzech miesięcy poprzedzających zdarzenie powodujące
                odpowiedzialność.
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                Powyższe ograniczenia nie wyłączają ani nie ograniczają odpowiedzialności Operatora w zakresie, w jakim
                jest to niedopuszczalne na mocy bezwzględnie obowiązujących przepisów prawa.
              </p>
            </LegalSection>

            <LegalSection id="postanowienia-koncowe" number={7} title="Postanowienia końcowe">
              <p className="text-body-default text-muted-foreground mb-4">
                Operator zastrzega sobie prawo do zmiany niniejszego Regulaminu. O każdej zmianie Użytkownicy zostaną
                poinformowani z co najmniej 14-dniowym wyprzedzeniem drogą e-mail oraz poprzez komunikat widoczny po
                zalogowaniu do Panelu Zarządzania. Dalsze korzystanie z Usługi po wejściu w życie zmian oznacza ich
                akceptację.
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                W sprawach nieuregulowanych niniejszym Regulaminem stosuje się przepisy prawa polskiego, w szczególności
                Kodeksu cywilnego, ustawy o świadczeniu usług drogą elektroniczną oraz RODO.
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                Wszelkie spory wynikające z korzystania z Usługi strony będą starały się rozwiązać polubownie. W
                przypadku braku porozumienia sądem właściwym do rozstrzygania sporów jest sąd powszechny właściwy dla
                siedziby Operatora — sąd we Wrocławiu.
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                Niniejszy Regulamin podlega prawu polskiemu. Jego treść dostępna jest w języku polskim, który stanowi
                wersję wiążącą.
              </p>
            </LegalSection>
          </article>
        </div>
      </div>
    </div>
  );
}

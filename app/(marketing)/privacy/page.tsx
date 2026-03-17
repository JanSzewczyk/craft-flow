import {
  ArrowRightLeftIcon,
  BuildingIcon,
  ClockIcon,
  CookieIcon,
  DatabaseIcon,
  EyeIcon,
  FolderIcon,
  MailIcon,
  MessageSquareWarningIcon,
  PauseCircleIcon,
  PencilIcon,
  ScaleIcon,
  ServerIcon,
  Share2Icon,
  ShieldCheckIcon,
  Trash2Icon,
  UserIcon
} from "lucide-react";

import {
  LegalBreadcrumbs,
  LegalPageHeader,
  LegalSection,
  LegalSidebar,
  PrivacyAdminCard,
  PrivacyDataItem,
  PrivacyPartnerItem,
  PrivacyRightItem,
  type LegalSidebarSection
} from "~/features/marketing/components";

const SECTIONS: readonly LegalSidebarSection[] = [
  { id: "administrator-danych", number: 1, title: "Administrator danych", icon: <BuildingIcon className="size-4" /> },
  {
    id: "zakres-zbieranych-danych",
    number: 2,
    title: "Zakres zbieranych danych",
    icon: <DatabaseIcon className="size-4" />
  },
  {
    id: "cel-i-podstawa-przetwarzania",
    number: 3,
    title: "Cel i podstawa przetwarzania",
    icon: <ScaleIcon className="size-4" />
  },
  {
    id: "przekazywanie-danych",
    number: 4,
    title: "Przekazywanie danych",
    icon: <Share2Icon className="size-4" />
  },
  {
    id: "okres-przechowywania",
    number: 5,
    title: "Okres przechowywania danych",
    icon: <ClockIcon className="size-4" />
  },
  {
    id: "prawa-uzytkownika",
    number: 6,
    title: "Prawa użytkownika (RODO)",
    icon: <ShieldCheckIcon className="size-4" />
  },
  { id: "pliki-cookie", number: 7, title: "Pliki cookie", icon: <CookieIcon className="size-4" /> }
] as const;

export default function PrivacyPage() {
  return (
    <div className="bg-muted/30 py-16">
      <div className="container">
        <LegalBreadcrumbs label="Polityka prywatności" />
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-12">
          <LegalSidebar sections={SECTIONS} helpEmail="privacy@craftflow.pl" />
          <article className="min-w-0 flex-1">
            <LegalPageHeader title="Polityka prywatności CraftFlow" lastUpdated="Ostatnia aktualizacja: marzec 2026" />

            {/* Section 1 — Administrator danych */}
            <LegalSection id="administrator-danych" number={1} title="Administrator danych">
              <p className="text-body-default text-muted-foreground mb-4">
                Administratorem danych osobowych przetwarzanych w związku z korzystaniem z usługi CraftFlow jest
                CraftFlow sp. z o.o. z siedzibą we Wrocławiu, ul. Przykładowa 1, 50-000 Wrocław, wpisana do rejestru
                przedsiębiorców Krajowego Rejestru Sądowego, NIP: 000-000-00-00 (dalej: &bdquo;Administrator&rdquo;).
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                We wszelkich sprawach dotyczących ochrony danych osobowych można kontaktować się z Administratorem pod
                adresem e-mail:{" "}
                <a href="mailto:privacy@craftflow.pl" className="text-primary underline underline-offset-4">
                  privacy@craftflow.pl
                </a>{" "}
                lub pisemnie na adres siedziby.
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                Dane osobowe przetwarzane są zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z
                dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych
                (RODO), ustawą o ochronie danych osobowych z dnia 10 maja 2018 r. oraz innymi obowiązującymi przepisami
                prawa.
              </p>
              <PrivacyAdminCard
                companyName="CraftFlow sp. z o.o."
                address="ul. Przykładowa 1, 50-000 Wrocław"
                nip="000-000-00-00"
                email="privacy@craftflow.pl"
              />
            </LegalSection>

            {/* Section 2 — Zakres zbieranych danych */}
            <LegalSection id="zakres-zbieranych-danych" number={2} title="Zakres zbieranych danych">
              <p className="text-body-default text-muted-foreground mb-4">
                W zależności od sposobu korzystania z Usługi Administrator może przetwarzać następujące kategorie danych
                osobowych:
              </p>
              <ul className="mt-4 list-none space-y-3 p-0">
                <PrivacyDataItem
                  icon={<UserIcon className="size-4" />}
                  title="Dane konta"
                  description="adres e-mail, imię i nazwisko lub nazwa firmy, podawane przy rejestracji i zarządzane za pośrednictwem Clerk."
                />
                <PrivacyDataItem
                  icon={<MailIcon className="size-4" />}
                  title="Dane subskrypcji i płatności"
                  description="historia transakcji, dane rozliczeniowe i status subskrypcji przetwarzane za pośrednictwem Stripe; dane kart płatniczych nie są przechowywane przez Administratora."
                />
                <PrivacyDataItem
                  icon={<FolderIcon className="size-4" />}
                  title="Dane projektów i klientów"
                  description="wszelkie informacje o zleceniach, klientach i kontrahentach wprowadzone do Usługi przez Użytkownika; Administrator przetwarza te dane wyłącznie na polecenie Użytkownika, który jest odrębnym administratorem tych danych."
                />
                <PrivacyDataItem
                  icon={<ServerIcon className="size-4" />}
                  title="Logi techniczne"
                  description="adres IP, user-agent przeglądarki, znacznik czasu (timestamp) żądania, kody odpowiedzi HTTP — zbierane automatycznie w celach diagnostycznych i bezpieczeństwa."
                />
              </ul>
            </LegalSection>

            {/* Section 3 — Cel i podstawa przetwarzania */}
            <LegalSection id="cel-i-podstawa-przetwarzania" number={3} title="Cel i podstawa przetwarzania">
              <p className="text-body-default text-muted-foreground mb-4">
                Dane osobowe przetwarzane są na podstawie następujących przesłanek prawnych:
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                <strong className="text-foreground">Realizacja umowy (art. 6 ust. 1 lit. b RODO)</strong> —
                przetwarzanie niezbędne do świadczenia Usługi, w tym obsługi konta, dostępu do funkcji subskrypcji i
                obsługi płatności.
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                <strong className="text-foreground">
                  Prawnie uzasadniony interes Administratora (art. 6 ust. 1 lit. f RODO)
                </strong>{" "}
                — zapewnienie bezpieczeństwa serwisu, wykrywanie nadużyć (fraud prevention), analiza i poprawa jakości
                Usługi, dochodzenie i obrona przed roszczeniami.
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                <strong className="text-foreground">Obowiązek prawny (art. 6 ust. 1 lit. c RODO)</strong> — wystawianie
                faktur VAT i prowadzenie dokumentacji rachunkowej zgodnie z przepisami podatkowymi (ustawa o
                rachunkowości, ustawa o podatku od towarów i usług).
              </p>
            </LegalSection>

            {/* Section 4 — Przekazywanie danych */}
            <LegalSection id="przekazywanie-danych" number={4} title="Przekazywanie danych">
              <p className="text-body-default text-muted-foreground mb-4">
                Administrator nie sprzedaje danych osobowych podmiotom trzecim ani nie udostępnia ich w celach
                marketingowych bez wyraźnej zgody Użytkownika.
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                W celu świadczenia Usługi Administrator korzysta z następujących podprocesorów, z każdym z których
                zawarta jest umowa powierzenia przetwarzania danych (DPA):
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <PrivacyPartnerItem name="Clerk" category="Autentykacja" />
                <PrivacyPartnerItem name="Stripe" category="Płatności" />
                <PrivacyPartnerItem name="Firebase / Google Cloud" category="Baza danych" />
                <PrivacyPartnerItem name="Resend" category="E-mail" />
                <PrivacyPartnerItem name="Vercel" category="Hosting" />
              </div>
              <p className="text-body-default text-muted-foreground mt-4 mb-4">
                Niektórzy z wymienionych podprocesorów mają siedziby poza Europejskim Obszarem Gospodarczym (EOG), w
                szczególności w Stanach Zjednoczonych. Przekazywanie danych do tych podmiotów odbywa się na podstawie
                standardowych klauzul umownych zatwierdzonych przez Komisję Europejską, zapewniających odpowiedni poziom
                ochrony danych.
              </p>
            </LegalSection>

            {/* Section 5 — Okres przechowywania danych */}
            <LegalSection id="okres-przechowywania" number={5} title="Okres przechowywania danych">
              <p className="text-body-default text-muted-foreground mb-4">
                Administrator przechowuje dane osobowe przez następujące okresy:
              </p>
              <ul className="text-body-default text-muted-foreground mb-4 list-inside list-disc space-y-1">
                <li>
                  <strong className="text-foreground">Dane konta i projekty</strong> — przez czas trwania aktywnej umowy
                  (Subskrypcji), a następnie przez 30 dni od daty anulowania konta, po czym są trwale usuwane. W tym
                  czasie Użytkownik może pobrać eksport swoich danych.
                </li>
                <li>
                  <strong className="text-foreground">Dane fakturowe i rozliczeniowe</strong> — przez 5 lat od końca
                  roku podatkowego, w którym wystawiono fakturę, zgodnie z obowiązkiem rachunkowym i podatkowym.
                </li>
                <li>
                  <strong className="text-foreground">Logi techniczne</strong> — przez 90 dni od daty ich wygenerowania,
                  po czym są automatycznie usuwane.
                </li>
              </ul>
              <p className="text-body-default text-muted-foreground mb-4">
                Po upływie wskazanych okresów dane są trwale i bezpowrotnie usuwane lub anonimizowane w sposób
                uniemożliwiający identyfikację osoby, której dotyczą.
              </p>
            </LegalSection>

            {/* Section 6 — Prawa użytkownika (RODO) */}
            <LegalSection id="prawa-uzytkownika" number={6} title="Prawa użytkownika (RODO)">
              <p className="text-body-default text-muted-foreground mb-4">
                Każdej osobie, której dane osobowe przetwarza Administrator, przysługują następujące prawa:
              </p>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <PrivacyRightItem
                  icon={<EyeIcon className="size-4" />}
                  title="Prawo dostępu (art. 15 RODO)"
                  description="prawo do uzyskania potwierdzenia, czy dane są przetwarzane, oraz uzyskania ich kopii."
                />
                <PrivacyRightItem
                  icon={<PencilIcon className="size-4" />}
                  title="Prawo sprostowania (art. 16 RODO)"
                  description="prawo do niezwłocznego poprawienia nieprawidłowych lub uzupełnienia niekompletnych danych."
                />
                <PrivacyRightItem
                  icon={<Trash2Icon className="size-4" />}
                  title="Prawo do usunięcia (art. 17 RODO)"
                  description="prawo do żądania usunięcia danych w przypadkach określonych w RODO (prawo do bycia zapomnianym)."
                />
                <PrivacyRightItem
                  icon={<PauseCircleIcon className="size-4" />}
                  title="Prawo do ograniczenia przetwarzania (art. 18 RODO)"
                  description="prawo do żądania wstrzymania przetwarzania danych w określonych przypadkach."
                />
                <PrivacyRightItem
                  icon={<ArrowRightLeftIcon className="size-4" />}
                  title="Prawo do przenoszenia danych (art. 20 RODO)"
                  description="prawo do otrzymania swoich danych w ustrukturyzowanym, powszechnie używanym formacie i przesłania ich innemu administratorowi."
                />
                <PrivacyRightItem
                  icon={<MessageSquareWarningIcon className="size-4" />}
                  title="Prawo sprzeciwu (art. 21 RODO)"
                  description="prawo do wniesienia sprzeciwu wobec przetwarzania danych opartego na prawnie uzasadnionym interesie Administratora."
                />
              </div>
              <p className="text-body-default text-muted-foreground mt-6 mb-4">
                Aby skorzystać z przysługujących praw, prosimy o kontakt pod adresem:{" "}
                <a href="mailto:privacy@craftflow.pl" className="text-primary underline underline-offset-4">
                  privacy@craftflow.pl
                </a>
                . Administrator odpowie na żądanie bez zbędnej zwłoki, nie później niż w ciągu 30 dni od jego
                otrzymania.
              </p>
            </LegalSection>

            {/* Section 7 — Pliki cookie */}
            <LegalSection id="pliki-cookie" number={7} title="Pliki cookie">
              <p className="text-body-default text-muted-foreground mb-4">
                Serwis CraftFlow używa wyłącznie plików cookie niezbędnych do prawidłowego działania aplikacji. Są to w
                szczególności:
              </p>
              <ul className="text-body-default text-muted-foreground mb-4 list-inside list-disc space-y-1">
                <li>
                  <strong className="text-foreground">Pliki sesji</strong> — umożliwiają utrzymanie stanu zalogowania
                  Użytkownika podczas korzystania z aplikacji.
                </li>
                <li>
                  <strong className="text-foreground">Preferencje motywu</strong> — przechowują wybraną przez
                  Użytkownika wersję kolorystyczną interfejsu (jasny/ciemny/systemowy).
                </li>
              </ul>
              <p className="text-body-default text-muted-foreground mb-4">
                Serwis CraftFlow <strong className="text-foreground">nie stosuje</strong> plików cookie reklamowych,
                śledzących ani analitycznych osób trzecich. Nie korzystamy z narzędzi remarketingowych ani profilowania
                behawioralnego.
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                Użytkownik może w dowolnym momencie wyłączyć lub usunąć pliki cookie w ustawieniach swojej przeglądarki
                internetowej. Wyłączenie niezbędnych plików cookie może jednak uniemożliwić prawidłowe korzystanie z
                Usługi, w tym utrzymanie sesji logowania.
              </p>
              <p className="text-body-default text-muted-foreground mb-4">
                Szczegółowe informacje o zarządzaniu plikami cookie w poszczególnych przeglądarkach dostępne są w
                dokumentacji producentów (np. Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge).
              </p>
            </LegalSection>
          </article>
        </div>
      </div>
    </div>
  );
}

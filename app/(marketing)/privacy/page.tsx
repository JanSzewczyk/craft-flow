import { Separator } from "@szum-tech/design-system";

export default function PrivacyPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Header */}
        <h1 className="text-display-sm font-poppins text-foreground mb-2">Polityka prywatności CraftFlow</h1>
        <p className="text-body-sm text-muted-foreground mb-12">Ostatnia aktualizacja: marzec 2026</p>
        <Separator />

        {/* 1 */}
        <section>
          <h2 className="text-heading-h2 text-foreground mt-10 mb-4">1. Administrator danych</h2>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Administratorem danych osobowych przetwarzanych w związku z korzystaniem z usługi CraftFlow jest CraftFlow
            sp. z o.o. z siedzibą we Wrocławiu, ul. Przykładowa 1, 50-000 Wrocław, wpisana do rejestru przedsiębiorców
            Krajowego Rejestru Sądowego, NIP: 000-000-00-00 (dalej: „Administrator").
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            We wszelkich sprawach dotyczących ochrony danych osobowych można kontaktować się z Administratorem pod
            adresem e-mail:{" "}
            <a href="mailto:privacy@craftflow.pl" className="text-primary underline underline-offset-4">
              privacy@craftflow.pl
            </a>{" "}
            lub pisemnie na adres siedziby.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Dane osobowe przetwarzane są zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia
            27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych (RODO),
            ustawą o ochronie danych osobowych z dnia 10 maja 2018 r. oraz innymi obowiązującymi przepisami prawa.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-heading-h2 text-foreground mt-10 mb-4">2. Zakres zbieranych danych</h2>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            W zależności od sposobu korzystania z Usługi Administrator może przetwarzać następujące kategorie danych
            osobowych:
          </p>
          <ul className="text-body-default text-muted-foreground mb-4 list-inside list-disc space-y-1">
            <li>
              <strong className="text-foreground">Dane konta</strong> — adres e-mail, imię i nazwisko lub nazwa firmy,
              podawane przy rejestracji i zarządzane za pośrednictwem Clerk.
            </li>
            <li>
              <strong className="text-foreground">Dane subskrypcji i płatności</strong> — historia transakcji, dane
              rozliczeniowe i status subskrypcji przetwarzane za pośrednictwem Stripe; dane kart płatniczych nie są
              przechowywane przez Administratora.
            </li>
            <li>
              <strong className="text-foreground">Dane projektów i klientów</strong> — wszelkie informacje o zleceniach,
              klientach i kontrahentach wprowadzone do Usługi przez Użytkownika; Administrator przetwarza te dane
              wyłącznie na polecenie Użytkownika, który jest odrębnym administratorem tych danych.
            </li>
            <li>
              <strong className="text-foreground">Logi techniczne</strong> — adres IP, user-agent przeglądarki, znacznik
              czasu (timestamp) żądania, kody odpowiedzi HTTP — zbierane automatycznie w celach diagnostycznych i
              bezpieczeństwa.
            </li>
          </ul>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-heading-h2 text-foreground mt-10 mb-4">3. Cel i podstawa przetwarzania</h2>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Dane osobowe przetwarzane są na podstawie następujących przesłanek prawnych:
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            <strong className="text-foreground">Realizacja umowy (art. 6 ust. 1 lit. b RODO)</strong> — przetwarzanie
            niezbędne do świadczenia Usługi, w tym obsługi konta, dostępu do funkcji subskrypcji i obsługi płatności.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            <strong className="text-foreground">
              Prawnie uzasadniony interes Administratora (art. 6 ust. 1 lit. f RODO)
            </strong>{" "}
            — zapewnienie bezpieczeństwa serwisu, wykrywanie nadużyć (fraud prevention), analiza i poprawa jakości
            Usługi, dochodzenie i obrona przed roszczeniami.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            <strong className="text-foreground">Obowiązek prawny (art. 6 ust. 1 lit. c RODO)</strong> — wystawianie
            faktur VAT i prowadzenie dokumentacji rachunkowej zgodnie z przepisami podatkowymi (ustawa o rachunkowości,
            ustawa o podatku od towarów i usług).
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-heading-h2 text-foreground mt-10 mb-4">4. Przekazywanie danych</h2>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Administrator nie sprzedaje danych osobowych podmiotom trzecim ani nie udostępnia ich w celach
            marketingowych bez wyraźnej zgody Użytkownika.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            W celu świadczenia Usługi Administrator korzysta z następujących podprocesorów, z każdym z których zawarta
            jest umowa powierzenia przetwarzania danych (DPA):
          </p>
          <ul className="text-body-default text-muted-foreground mb-4 list-inside list-disc space-y-1">
            <li>
              <strong className="text-foreground">Clerk</strong> — autoryzacja i zarządzanie kontami użytkowników.
            </li>
            <li>
              <strong className="text-foreground">Stripe</strong> — obsługa płatności i zarządzanie subskrypcjami.
            </li>
            <li>
              <strong className="text-foreground">Firebase / Google Cloud</strong> — przechowywanie danych aplikacji w
              bazie danych.
            </li>
            <li>
              <strong className="text-foreground">Resend</strong> — wysyłka wiadomości e-mail transakcyjnych
              (powiadomienia, faktury).
            </li>
            <li>
              <strong className="text-foreground">Vercel</strong> — hosting i infrastruktura serwerowa aplikacji.
            </li>
          </ul>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Niektórzy z wymienionych podprocesorów mają siedziby poza Europejskim Obszarem Gospodarczym (EOG), w
            szczególności w Stanach Zjednoczonych. Przekazywanie danych do tych podmiotów odbywa się na podstawie
            standardowych klauzul umownych zatwierdzonych przez Komisję Europejską, zapewniających odpowiedni poziom
            ochrony danych.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-heading-h2 text-foreground mt-10 mb-4">5. Okres przechowywania danych</h2>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Administrator przechowuje dane osobowe przez następujące okresy:
          </p>
          <ul className="text-body-default text-muted-foreground mb-4 list-inside list-disc space-y-1">
            <li>
              <strong className="text-foreground">Dane konta i projekty</strong> — przez czas trwania aktywnej umowy
              (Subskrypcji), a następnie przez 30 dni od daty anulowania konta, po czym są trwale usuwane. W tym czasie
              Użytkownik może pobrać eksport swoich danych.
            </li>
            <li>
              <strong className="text-foreground">Dane fakturowe i rozliczeniowe</strong> — przez 5 lat od końca roku
              podatkowego, w którym wystawiono fakturę, zgodnie z obowiązkiem rachunkowym i podatkowym.
            </li>
            <li>
              <strong className="text-foreground">Logi techniczne</strong> — przez 90 dni od daty ich wygenerowania, po
              czym są automatycznie usuwane.
            </li>
          </ul>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Po upływie wskazanych okresów dane są trwale i bezpowrotnie usuwane lub anonimizowane w sposób
            uniemożliwiający identyfikację osoby, której dotyczą.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-heading-h2 text-foreground mt-10 mb-4">6. Prawa użytkownika (RODO)</h2>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Każdej osobie, której dane osobowe przetwarza Administrator, przysługują następujące prawa:
          </p>
          <ul className="text-body-default text-muted-foreground mb-4 list-inside list-disc space-y-1">
            <li>
              <strong className="text-foreground">Prawo dostępu (art. 15 RODO)</strong> — prawo do uzyskania
              potwierdzenia, czy dane są przetwarzane, oraz uzyskania ich kopii.
            </li>
            <li>
              <strong className="text-foreground">Prawo sprostowania (art. 16 RODO)</strong> — prawo do niezwłocznego
              poprawienia nieprawidłowych lub uzupełnienia niekompletnych danych.
            </li>
            <li>
              <strong className="text-foreground">Prawo do usunięcia (art. 17 RODO)</strong> — prawo do żądania
              usunięcia danych w przypadkach określonych w RODO (prawo do bycia zapomnianym).
            </li>
            <li>
              <strong className="text-foreground">Prawo do ograniczenia przetwarzania (art. 18 RODO)</strong> — prawo do
              żądania wstrzymania przetwarzania danych w określonych przypadkach.
            </li>
            <li>
              <strong className="text-foreground">Prawo do przenoszenia danych (art. 20 RODO)</strong> — prawo do
              otrzymania swoich danych w ustrukturyzowanym, powszechnie używanym formacie i przesłania ich innemu
              administratorowi.
            </li>
            <li>
              <strong className="text-foreground">Prawo sprzeciwu (art. 21 RODO)</strong> — prawo do wniesienia
              sprzeciwu wobec przetwarzania danych opartego na prawnie uzasadnionym interesie Administratora.
            </li>
            <li>
              <strong className="text-foreground">Prawo skargi do organu nadzorczego (Prezes UODO)</strong> — prawo do
              wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (
              <a
                href="https://uodo.gov.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                uodo.gov.pl
              </a>
              ), jeśli uznasz, że przetwarzanie Twoich danych narusza przepisy RODO.
            </li>
          </ul>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Aby skorzystać z przysługujących praw, prosimy o kontakt pod adresem:{" "}
            <a href="mailto:privacy@craftflow.pl" className="text-primary underline underline-offset-4">
              privacy@craftflow.pl
            </a>
            . Administrator odpowie na żądanie bez zbędnej zwłoki, nie później niż w ciągu 30 dni od jego otrzymania.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-heading-h2 text-foreground mt-10 mb-4">7. Pliki cookie</h2>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Serwis CraftFlow używa wyłącznie plików cookie niezbędnych do prawidłowego działania aplikacji. Są to w
            szczególności:
          </p>
          <ul className="text-body-default text-muted-foreground mb-4 list-inside list-disc space-y-1">
            <li>
              <strong className="text-foreground">Pliki sesji</strong> — umożliwiają utrzymanie stanu zalogowania
              Użytkownika podczas korzystania z aplikacji.
            </li>
            <li>
              <strong className="text-foreground">Preferencje motywu</strong> — przechowują wybraną przez Użytkownika
              wersję kolorystyczną interfejsu (jasny/ciemny/systemowy).
            </li>
          </ul>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Serwis CraftFlow <strong className="text-foreground">nie stosuje</strong> plików cookie reklamowych,
            śledzących ani analitycznych osób trzecich. Nie korzystamy z narzędzi remarketingowych ani profilowania
            behawioralnego.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Użytkownik może w dowolnym momencie wyłączyć lub usunąć pliki cookie w ustawieniach swojej przeglądarki
            internetowej. Wyłączenie niezbędnych plików cookie może jednak uniemożliwić prawidłowe korzystanie z Usługi,
            w tym utrzymanie sesji logowania.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Szczegółowe informacje o zarządzaniu plikami cookie w poszczególnych przeglądarkach dostępne są w
            dokumentacji producentów (np. Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge).
          </p>
        </section>
      </div>
    </div>
  );
}

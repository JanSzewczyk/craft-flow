import { Separator } from "@szum-tech/design-system";

export default function TermsPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto max-w-3xl px-4">
        {/* Header */}
        <h1 className="text-display-sm font-poppins text-foreground mb-2">Regulamin usługi CraftFlow</h1>
        <p className="text-body-sm text-muted-foreground mb-12">Ostatnia aktualizacja: marzec 2026</p>
        <Separator />

        {/* §1 */}
        <section>
          <h2 className="text-heading-h2 text-foreground mt-10 mb-4">§1 Postanowienia ogólne</h2>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Niniejszy Regulamin określa zasady korzystania z usługi CraftFlow — internetowej platformy zarządzania
            projektami i relacjami z klientami, dedykowanej rzemieślnikom i małym warsztatom.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Właścicielem i operatorem serwisu CraftFlow jest CraftFlow sp. z o.o. z siedzibą we Wrocławiu, wpisana do
            rejestru przedsiębiorców Krajowego Rejestru Sądowego, NIP: 000-000-00-00 (dalej: „Operator").
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Korzystanie z Usługi, w tym rejestracja konta, oznacza zapoznanie się z treścią niniejszego Regulaminu oraz
            bezwarunkową akceptację wszystkich jego postanowień. Jeżeli nie akceptujesz Regulaminu, prosimy o
            zaprzestanie korzystania z Usługi.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Regulamin jest dostępny bezpłatnie na stronie internetowej CraftFlow w formie umożliwiającej jego pobranie,
            utrwalenie i wydrukowanie.
          </p>
        </section>

        {/* §2 */}
        <section>
          <h2 className="text-heading-h2 text-foreground mt-10 mb-4">§2 Definicje</h2>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Na potrzeby niniejszego Regulaminu przyjmuje się następujące definicje:
          </p>
          <ul className="text-body-default text-muted-foreground mb-4 list-inside list-disc space-y-1">
            <li>
              <strong className="text-foreground">Usługa</strong> — platforma CraftFlow dostępna pod adresem
              craftflow.pl, umożliwiająca zarządzanie projektami, zleceniami i komunikacją z klientami.
            </li>
            <li>
              <strong className="text-foreground">Użytkownik / Wykonawca</strong> — osoba fizyczna prowadząca
              działalność gospodarczą lub osoba prawna, która zarejestrowała konto w serwisie i korzysta z Usługi w celu
              prowadzenia swojego warsztatu lub działalności rzemieślniczej.
            </li>
            <li>
              <strong className="text-foreground">Klient</strong> — osoba fizyczna lub prawna, której dane zostały
              wprowadzone do Usługi przez Użytkownika jako odbiorca wykonywanych przez niego zleceń.
            </li>
            <li>
              <strong className="text-foreground">Subskrypcja</strong> — odpłatny dostęp do Usługi w ramach wybranego
              Planu, odnawiany automatycznie w cyklach miesięcznych.
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
        </section>

        {/* §3 */}
        <section>
          <h2 className="text-heading-h2 text-foreground mt-10 mb-4">§3 Rejestracja i konto</h2>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Rejestracja w Usłudze wymaga podania aktywnego adresu e-mail oraz utworzenia hasła zgodnego z wymaganiami
            bezpieczeństwa. Podanie nieprawdziwych danych jest zabronione i może skutkować usunięciem konta.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Użytkownik jest wyłącznie odpowiedzialny za bezpieczeństwo swoich danych logowania, w tym za utrzymanie
            hasła w poufności. W przypadku podejrzenia nieautoryzowanego dostępu do konta Użytkownik zobowiązany jest
            niezwłocznie poinformować Operatora pod adresem support@craftflow.pl.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Dopuszczalne jest posiadanie wyłącznie jednego konta przypisanego do jednej osoby fizycznej lub jednej
            firmy. Tworzenie kont przez boty, skrypty lub w sposób zautomatyzowany jest zabronione.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Operator zastrzega sobie prawo do weryfikacji tożsamości Użytkownika oraz do zawieszenia lub usunięcia konta
            w przypadku naruszenia niniejszego Regulaminu.
          </p>
        </section>

        {/* §4 */}
        <section>
          <h2 className="text-heading-h2 text-foreground mt-10 mb-4">§4 Subskrypcja i płatności</h2>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Usługa dostępna jest w trzech planach subskrypcyjnych: Basic, Standard oraz Premium, różniących się zakresem
            funkcjonalności i limitami projektów oraz klientów. Aktualne ceny i zakresy planów dostępne są na stronie
            craftflow.pl/pricing.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Rozliczenie odbywa się miesięcznie z góry, w dniu pierwszej płatności lub rocznicy subskrypcji. Do
            realizacji płatności Operator korzysta z zewnętrznego procesora płatności Stripe. Operator nie przechowuje
            danych kart płatniczych.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Nowi Użytkownicy mogą skorzystać z 14-dniowego okresu próbnego Planu Premium bez podawania danych karty
            płatniczej. Po upływie okresu próbnego konto przechodzi automatycznie na Plan Basic (bezpłatny) lub na
            wybrany przez Użytkownika plan płatny.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Anulowanie Subskrypcji jest możliwe w dowolnym momencie z poziomu Panelu Zarządzania. Anulowanie wywołuje
            skutek na koniec bieżącego okresu rozliczeniowego — Użytkownik zachowuje dostęp do opłaconych funkcji do
            końca opłaconego okresu. Operator nie zwraca opłat proporcjonalnych za niewykorzystany czas.
          </p>
        </section>

        {/* §5 */}
        <section>
          <h2 className="text-heading-h2 text-foreground mt-10 mb-4">§5 Prawa i obowiązki Użytkownika</h2>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Użytkownik zobowiązuje się do korzystania z Usługi wyłącznie w celach zgodnych z obowiązującym prawem,
            niniejszym Regulaminem oraz dobrymi obyczajami.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
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
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Użytkownik ponosi pełną odpowiedzialność za treści i dane wprowadzane do Usługi, w tym za zgodność ich
            przetwarzania z przepisami o ochronie danych osobowych (RODO) w stosunku do swoich Klientów.
          </p>
        </section>

        {/* §6 */}
        <section>
          <h2 className="text-heading-h2 text-foreground mt-10 mb-4">§6 Ograniczenie odpowiedzialności</h2>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Usługa świadczona jest w stanie „takim, jakim jest" (ang. <em>as is</em>) i „w miarę dostępności" (ang.{" "}
            <em>as available</em>). Operator dokłada wszelkich starań, aby Usługa była dostępna przez całą dobę, jednak
            nie gwarantuje nieprzerwanego działania serwisu.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Operator nie ponosi odpowiedzialności za przerwy techniczne wynikające z konserwacji infrastruktury, awarii
            zewnętrznych dostawców usług (hostingu, baz danych, procesorów płatności) ani za działania siły wyższej.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            W najszerszym zakresie dopuszczalnym przez obowiązujące prawo łączna odpowiedzialność Operatora wobec
            Użytkownika z tytułu wszelkich roszczeń związanych z Usługą ograniczona jest do wartości opłat uiszczonych
            przez Użytkownika w ciągu ostatnich trzech miesięcy poprzedzających zdarzenie powodujące odpowiedzialność.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Powyższe ograniczenia nie wyłączają ani nie ograniczają odpowiedzialności Operatora w zakresie, w jakim jest
            to niedopuszczalne na mocy bezwzględnie obowiązujących przepisów prawa.
          </p>
        </section>

        {/* §7 */}
        <section>
          <h2 className="text-heading-h2 text-foreground mt-10 mb-4">§7 Postanowienia końcowe</h2>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Operator zastrzega sobie prawo do zmiany niniejszego Regulaminu. O każdej zmianie Użytkownicy zostaną
            poinformowani z co najmniej 14-dniowym wyprzedzeniem drogą e-mail oraz poprzez komunikat widoczny po
            zalogowaniu do Panelu Zarządzania. Dalsze korzystanie z Usługi po wejściu w życie zmian oznacza ich
            akceptację.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            W sprawach nieuregulowanych niniejszym Regulaminem stosuje się przepisy prawa polskiego, w szczególności
            Kodeksu cywilnego, ustawy o świadczeniu usług drogą elektroniczną oraz RODO.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Wszelkie spory wynikające z korzystania z Usługi strony będą starały się rozwiązać polubownie. W przypadku
            braku porozumienia sądem właściwym do rozstrzygania sporów jest sąd powszechny właściwy dla siedziby
            Operatora — sąd we Wrocławiu.
          </p>
          <p className="text-body-default text-muted-foreground mb-4 leading-relaxed">
            Niniejszy Regulamin podlega prawu polskiemu. Jego treść dostępna jest w języku polskim, który stanowi wersję
            wiążącą.
          </p>
        </section>
      </div>
    </div>
  );
}

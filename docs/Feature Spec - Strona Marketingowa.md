# 🧩 Feature Spec: Strefa Publiczna (Marketing i SEO)

**Moduł:** Strona Marketingowa (Publiczna)

**Powiązane trasy:** /, /features, /pricing, /about-us, /contact, /terms, /privacy

**Grupa routingu (Next.js):** app/(marketing)

**Zależności:** next/metadata (SEO), shadcn/ui, Clerk (linkowanie), Resend (wysyłka formularza)

## 1\. 🖥️ Współdzielony Layout i Nawigacja

Wszystkie strony marketingowe korzystają ze wspólnego pliku app/(marketing)/layout.tsx.

### 1.1. Globalny Nagłówek (Sticky Header)

- **Logo:** Klikalne, prowadzi zawsze do /.
- **Nawigacja (Desktop):** Linki tekstowe: Funkcje, Cennik, O nas, Kontakt.
- **Nawigacja (Mobile):** Ukryta w Hamburger Menu (komponent Sheet z shadcn/ui).
- **Akcje (Prawa strona):**
  - Zaloguj się (Przycisk wariantu _Ghost_ lub _Outline_, linkuje do /sign-in).
  - Wypróbuj za darmo (Główny przycisk CTA wariantu _Default_, linkuje do /pricing lub bezpośrednio do /sign-up).

### 1.2. Globalna Stopka (Footer)

- Kolumny z linkami:
  - Produkt (Funkcje, Cennik, Logowanie)
  - Firma (O nas, Kontakt)
  - Prawne (Regulamin, Polityka Prywatności)
- Nota o prawach autorskich (Copyright) i linki do Social Media.

## 2\. 📄 Architektura Stron i Treść (Copywriting Structure)

### 2.1. Strona Główna (/) - Landing Page

Zaprojektowana w celu maksymalizacji konwersji (Landing Page).

- **Hero Section:** Mocny nagłówek (H1) rozwiązujący główny problem (np. _"Zakończ erę ciągłych telefonów od
  klientów."_). Podtytuł opisujący wartość. Dwa przyciski: "Rozpocznij 14-dniowy okres próbny" i "Zobacz jak to działa".
  Obok/pod spodem: duży, atrakcyjny Mockup portalu klienta na telefonie.
- **Problem & Rozwiązanie:** 3 kolumny z ikonami tłumaczące przewagi (np. 1. Mniej telefonów, 2. Profesjonalny
  wizerunek, 3. Porządek w plikach).
- **Social Proof:** Sekcja z opiniami wczesnych użytkowników (Testimonial Cards).
- **Bottom CTA:** Powtórzenie wezwania do akcji na ciemnym tle przed stopką.

### 2.2. Funkcje (/features)

Głębsze zanurzenie w możliwości aplikacji.

- Sekcje ułożone na przemian (Z-pattern): Tekst po lewej, Grafika po prawej (i odwrotnie).
- Opisy: Oś czasu (Timeline), Portal Klienta, Baza CRM, Szablony, Powiadomienia e-mail.

### 2.3. Cennik (/pricing) - Kluczowy element przepływu

Wyświetla 3 pakiety (Basic, Standard, Premium) w formie kart (Pricing Cards).

- **Mechanika Intencji:** Główny przycisk na każdej karcie cennika musi linkować do ścieżki rejestracji z przekazaniem
  parametru URL (np. href="/sign-up?plan=standard").
- **Sekcja FAQ:** Akordeon (komponent Accordion z shadcn/ui) z odpowiedziami na najczęstsze pytania ułatwiające decyzję
  zakupową.

### 2.4. O nas (/about-us)

Strona budująca zaufanie i pokazująca ludzką twarz za aplikacją.

- **Historia i Misja:** Krótka opowieść o tym, dlaczego powstał CraftFlow.
- **Nasze Wartości:** Proste kafelki z wartościami firmy (np. Szacunek do czasu, Transparentność, Prostota).
- **Zespół / Twórcy:** Krótka nota biograficzna, zdjęcie twórcy/zespołu.

### 2.5. Kontakt (/contact)

Strona ułatwiająca komunikację z potencjalnymi i obecnymi klientami SaaS'a.

- **Układ dwukolumnowy (Desktop):**
  - **Lewa kolumna (Informacje):** Bezpośredni adres e-mail (np. <kontakt@craftflow.pl>), godziny pracy supportu oraz
    sekcja "Zanim napiszesz" z mini-FAQ (odciąża support z podstawowych pytań).
  - **Prawa kolumna (Formularz):** \* Pola: Imię, E-mail, Temat (Select: np. Pytanie o ofertę, Problem techniczny,
    Inne), Wiadomość (Textarea).
    - Walidacja za pomocą Zod po stronie klienta i serwera.
    - Po wysłaniu (Server Action z użyciem Resend) - formularz zamienia się na okienko sukcesu (Success State) z
      informacją: _"Dziękujemy za wiadomość! Odezwiemy się w ciągu 24 godzin."_

### 2.6. Strony Prawne (/terms, /privacy)

Proste, czytelne widoki oparte na wyśrodkowanym kontenerze z tekstem w formacie Prose (np. z użyciem
@tailwindcss/typography). Zoptymalizowane pod kątem szybkiego czytania.

## 3\. ⚙️ Logika Techniczna i Optymalizacja (SEO)

Strefa marketingowa ma jedno główne zadanie techniczne: **Ładować się błyskawicznie i indeksować się w Google (100
punktów w Lighthouse).**

### 3.1. React Server Components (RSC)

- **Zasada 100% Server-Side:** Żadna strona w strefie marketingowej nie powinna domyślnie używać dyrektywy 'use client',
  z wyjątkiem specyficznych, małych mikro-komponentów interaktywnych (np. Hamburger Menu, Akordeon w FAQ, Formularz
  Kontaktowy). Cała treść, obrazki i layout muszą być renderowane po stronie serwera (SSR / Static Generation).
- Brak odpytywania bazy danych Firebase w strefie publicznej.

### 3.2. Metadane (Next.js Metadata API)

Każda podstrona musi mieć zdefiniowane własne tagi Meta do pozycjonowania i poprawnego wyświetlania w Social Mediach
(OpenGraph).

// Przykład: app/(marketing)/pricing/page.tsx  
import { Metadata } from 'next'  
<br/>export const metadata: Metadata = {  
title: 'Cennik CraftFlow - Wybierz plan dla swojego warsztatu',  
description: 'Rozpocznij 14-dniowy darmowy okres próbny. Sprawdź plany i cennik oprogramowania dla stolarzy i
rzemieślników.',  
openGraph: {  
title: 'Cennik CraftFlow',  
description: 'Aplikacja dla rzemieślników. Sprawdź nasze plany.',  
images: \['/og-image-pricing.png'\], // Wymagany obrazek do udostępniania  
}  
}

### 3.3. Optymalizacja Obrazów

- Wszystkie grafiki, mockupy i logotypy muszą być renderowane za pomocą komponentu &lt;Image /&gt; z pakietu next/image
  (zapewnia automatyczną konwersję do formatu WebP/AVIF, Lazy Loading oraz optymalizację rozmiaru bazując na
  urządzeniu).

## 4\. 🚨 Edge Cases i Reguły Routing'u

- **Zabezpieczenie formularza kontaktowego (Anti-Spam):** Opcjonalne dodanie niewidocznego pola (Honeypot) lub
  integracja z Turnstile/reCAPTCHA v3 w Server Action w celu zablokowania botów wysyłających spam.
- **Użytkownik zalogowany na stronie głównej:** Jeśli użytkownik, który ma już konto (i aktywną sesję w Clerk), wejdzie
  na craftflow.pl, system **nie powinien** go wyrzucać. Jednak nawigacja (Header) powinna to rozpoznać.
  - _Rozwiązanie (Clerk UI):_ W komponencie Nagłówka używamy gotowych komponentów &lt;SignedIn&gt; oraz
    &lt;SignedOut&gt;.
  - Jeśli wylogowany: Pokazujemy "Zaloguj się" i "Wypróbuj".
  - Jeśli zalogowany: Pokazujemy przycisk "Przejdź do Dashboardu" (link do /app/dashboard) oraz awatar &lt;UserButton
    /&gt;.
- **Przycisk "Zaloguj się" a Middleware:** Link /sign-in kieruje do środowiska Clerk. Strona logowania musi być
  obsłużona bezbłędnie (redirect do /app/dashboard po udanym logowaniu lub do /onboarding, jeśli nie skończył
  konfiguracji).

## Stitch Instructions

Get the images and code for the following Stitch project's screens:

## Project

Title: Strona Główna - CraftFlow ID: 7699469399408055179

## Screens:

1. CraftFlow - Features Deep-Dive ID: 5d360ccc3de44be991385e01c74caf7d

Use a utility like `curl -L` to download the hosted URLs.

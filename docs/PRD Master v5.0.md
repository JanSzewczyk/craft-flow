# **📘 PRD Master v5.0: Główna Specyfikacja Projektowa "CraftFlow"**

**Nazwa Projektu:** CraftFlow

**Typ:** B2B2C SaaS (Software as a Service)

**Data Aktualizacji:** Marzec 2026

**Wersja:** 5.0 (Architektura Relacyjna \- Supabase)

## **1\. 🎯 Wizja i Cel Produktu**

**Problem:** Rzemieślnicy (stolarze, hydraulicy, wykończeniowcy) tracą mnóstwo czasu na odpowiadanie na pytania klientów
("Na jakim etapie jest moje zamówienie?"). Dokumenty, umowy i zdjęcia z realizacji są rozproszone po SMS-ach, mailach i
komunikatorach.

**Rozwiązanie:** CraftFlow to prosta platforma SaaS, która pozwala rzemieślnikowi utworzyć "Oś czasu projektu" i
udostępnić ją klientowi za pomocą jednego linku.

**Model Wzrostu (PLG \- Product-Led Growth):** Klienci otrzymują link do swojego projektu jako "Goście", ale są
zachęcani do założenia darmowego konta, aby zachować historię zlecenia. Gdy zakładają konto, wchodzą do ekosystemu
CraftFlow, stając się darmowym kanałem marketingowym.

## **2\. 🛠️ Stos Technologiczny (Tech Stack)**

Architektura została zoptymalizowana pod kątem bezpieczeństwa, wydajności (SEO) oraz przewidywalności kosztów przy dużej
ilości plików (zdjęcia realizacji).

- **Framework Główny:** Next.js (App Router) \- React Server Components (RSC) & Server Actions.
- **Baza Danych:** Supabase (PostgreSQL) \+ Drizzle ORM. Zapewnia integralność relacyjną (Klucze Obce, Cascade Delete) i
  nielimitowane odczyty.
- **Storage (Pliki):** Supabase Storage z wykorzystaniem wbudowanej transformacji obrazów w locie (optymalizacja kosztów
  transferu).
- **Autoryzacja:** Clerk (Custom UI zbudowane w oparciu o komponenty shadcn/ui, API Hooks useSignUp, useSignIn).
- **Płatności:** Stripe (Billing, Checkout) zintegrowany z webhookami i Middleware.
- **E-mail:** Resend \+ React Email.
- **UI & Styling:** Tailwind CSS, shadcn/ui, lucide-react (ikony).

## **3\. 🧩 Główne Moduły Systemu (Core Features)**

System dzieli się na 4 odizolowane od siebie (dzięki Middleware) strefy.

### **3.1. Strefa Marketingowa i Publiczna**

Zoptymalizowana pod SEO, renderowana po stronie serwera (SSR/SSG).

- Trasy: /, /pricing, /features, /about-us, /contact, /terms, /privacy.
- Dedykowana intencja zakupowa z Cennika: Przekazywanie parametru ?intent=contractor do formularza rejestracji.

### **3.2. Moduł Rejestracji i Onboardingu (Auth-then-Gate)**

Wykorzystuje Custom UI i darmową weryfikację tożsamości w Clerk przed wpuszczeniem za "Paywall".

- **Rejestracja:** Użytkownik zakłada konto. Formularz nadaje mu w publicMetadata role (np. roles: \["contractor"\]).
- **Wybór Planu:** Wymuszenie wyboru subskrypcji (Stripe) przed wejściem do aplikacji.
- **Zapis Stanu (State Persistence):** Konfiguracja (Stepper) zapisuje swój postęp w bazie danych Supabase, zapobiegając
  utracie danych przy odświeżeniu.
- **Ochrona Middleware:** Zablokowanie dostępu do tras /app/\* dla osób bez statusu onboardingComplete: true i aktywnego
  planu.

### **3.3. Strefa Wykonawcy (Contractor Dashboard)**

Główne narzędzie pracy rzemieślnika (/app/\*).

- **Zarządzanie Projektami (/app/projects):** Tabela projektów z paginacją. Możliwość tworzenia nowych zleceń.
- **Oś Czasu Projektu:** Dodawanie etapów, oznaczanie ich jako ukończone.
- **Pliki i Załączniki:** Wgrywanie umów (PDF) i zdjęć (JPEG/PNG/WEBP). Storage Supabase serwuje zoptymalizowane
  miniatury.
- **Szablony (/app/templates):** Tworzenie "przepisów" na projekty (np. "Montaż okien"). Wykorzystują zasadę _Deep Copy_
  – powielają się do projektu, nie wiążąc się z nim relacyjnie na przyszłość.
- **Baza Klientów / CRM (/app/clients):** Zarządzanie kontaktami. E-mail jest wymagany, telefon opcjonalny. Ochrona
  relacyjna przed usunięciem klienta z przypisanymi projektami.
- **Branding (/app/branding):** Personalizacja (Logo, Kolor główny, domyślna wiadomość e-mail) widoczna dla klientów
  danego wykonawcy.

### **3.4. Strefa Klienta i Mechanika PLG**

Widoki zoptymalizowane pod urządzenia mobilne, budujące zaufanie.

- **Widok Gościa (/status/\[publicToken\]):** Czysty, read-only widok projektu nałożony na branding wykonawcy.
  Wykorzystuje Data Mock Object (DMO), aby haker nie wyciągnął wewnętrznych notatek z bazy.
- **Authwall (PLG):** Zachęta na osi czasu do założenia konta w celu "zapisania historii remontu na zawsze".
- **Auto-Scalanie Kont (Magia CRM):** Gdy klient zakłada konto, serwer wyszukuje jego e-mail we wszystkich bazach CRM w
  systemie (nawet u innych rzemieślników) i łączy historyczne projekty z jego nowym, globalnym ID z Clerka.
- **Portal Klienta (/client-portal):** Dashboard dla zarejestrowanego klienta, z podziałem na "Aktywne" i "Historia".

### **3.5. Panel Administratora (Właściciela SaaS)**

Ukryta strefa dostępna tylko po przypisaniu roli admin w panelu Clerka.

- Trasy: /admin, /admin/contractors, /admin/clients.
- Dostęp do KPI (Liczba aktywnych wykonawców, MRR, przyrost PLG).
- Możliwość zablokowania konta Wykonawcy (Ban) i wsparcia technicznego (Impersonate).

## **4\. 🗄️ Architektura Danych (Relacyjna)**

System oparty o PostgreSQL (Supabase) zarządzany przez Drizzle ORM.

- **Klucze i Typy:** Unikalne UUID dla rekordów. Clerk ID (varchar) używane jako główny łącznik tożsamości
  (contractorId, clientAuthId).
- **Integralność:** Baza zapobiega anomaliom. Usunięcie wykonawcy czyści jego projekty (CASCADE). Usunięcie klienta z
  projektami jest blokowane (RESTRICT).
- **Brak "Users Table":** Tożsamość (E-maile, hasła, 2FA) mieszka w Clerk. Baza danych zajmuje się tylko relacjami
  biznesowymi.

## **5\. 💳 Monetyzacja i Limity (Feature Gating)**

Model subskrypcyjny B2B z 14-dniowym okresem próbnym (Trial).

1. **Basic Plan:**
   - Limit aktywnych projektów w toku: 5
   - Limit szablonów: 2
   - Branding: Zablokowany (Domyślny wygląd CraftFlow)
2. **Standard Plan (Najpopularniejszy):**
   - Limit aktywnych projektów w toku: 20
   - Limit szablonów: 10
   - Branding: Odblokowany (Własne logo i kolory w portalu klienta)
3. **Premium Plan:**
   - Nielimitowane projekty i szablony.
   - Branding: Odblokowany.
   - Opcjonalnie w przyszłości: Dostęp do API dla rzemieślnika.

## **6\. 🛡️ Kluczowe Zasady Bezpieczeństwa (Hard Rules)**

1. **Middleware jest Święty:** Logika middleware.ts musi weryfikować flagę onboardingComplete oraz roles dla każdej
   trasy prywatnej. Nie polegamy na ukrywaniu przycisków na frontendzie.
2. **Server Actions First:** Jakiekolwiek modyfikacje (Write) w bazie danych odbywają się wyłącznie przez Next.js Server
   Actions z obowiązkową walidacją wejścia (Zod) i weryfikacją tożsamości (auth().userId).
3. **Optymalizacja Kosztów:** Używamy .count() w SQL dla statystyk, a w widokach tabel stosujemy rygorystyczną paginację
   (LIMIT, OFFSET).

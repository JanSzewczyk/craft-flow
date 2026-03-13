# 📄 Product Requirements Document: CraftFlow (Master Specyfikacja)

**Wersja:** 4.9 (Sformatowana)

**Data:** Marzec 2026

**Status:** 🟢 Zatwierdzony do dewelopmentu (Milestone 1 - MVP)

**Typ dokumentu:** Specyfikacja Funkcjonalno-Techniczna (P&TS).

## 1\. 🎯 Wizja i Cele

**CraftFlow** to aplikacja SaaS (Single Web App) stworzona dla rzemieślników. Jej celem jest wyeliminowanie ciągłych
telefonów od klientów poprzez dedykowany portal podglądu postępów w czasie rzeczywistym.

**Główne założenia:** System ma być ekstremalnie intuicyjny, oparty na minimalizmie (biblioteka shadcn/ui) i od początku
wspierać rozwój organiczny (Product-Led Growth - PLG).

## 2\. 🗺️ Podział na Milestones (Roadmapa)

### 🔴 Milestone 1: MVP (Wersja Startowa - Cel Obecny)

- **Strona publiczna:** Rozbudowana strefa marketingowa (SEO, Cennik, Strony Prawne).
- **Autoryzacja:** Profile i płatności zarządzane w 100% przez **Clerk**.
- **Trial:** Ścieżka No-Friction Trial (14 dni Premium bez podawania karty).
- **Onboarding:** 5-krokowy kreator dla Wykonawcy (z generowaniem "Demo Projektu").
- **Dashboard:** Strefa /app z pełną obsługą projektów, klientów, szablonów i brandingu.
- **Portal Klienta:** Widok Gościa (Guest View) oraz opcjonalna Rejestracja Klienta (PLG).
- **Powiadomienia i Pliki:** Maile transakcyjne (Resend) i bezpieczny upload zdjęć (Firebase Storage).

### 🟡 Milestone 2 & 3 (Przyszłość - Poza obecnym zakresem)

- **Komunikacja:** Czat wewnątrz aplikacji i moduł akceptacji etapów przez klientów.
- **Optymalizacja:** Client-side Image Compression (kompresja zdjęć na urządzeniu przed wysłaniem).
- **Retencja:** E-mail ratunkowy (przywracanie porzuconego procesu Onboardingu).

## 3\. 💳 Specyfikacja Planów (Feature Gating)

**Zasada Quota-based:** Limity projektów odnawiają się w każdym cyklu rozliczeniowym. Rejestracja klientów w portalu
jest udostępniona we wszystkich planach dla budowania bazy PLG.

|

| **Cecha / Funkcja** | **🥉 Basic (79 PLN)** | **🥈 Standard (149 PLN)** | **🥇 Premium (299 PLN)** |

| **Tworzenie nowych projektów** | Max 5 / miesiąc | Max 20 / miesiąc | ✅ **Bez limitu** |

| **Ilość Szablonów Etapów** | Max 2 szablony | Max 10 szablonów | ✅ **Bez limitu** |

| **Historia i Archiwum** | ✅ Pełny dostęp | ✅ Pełny dostęp | ✅ Pełny dostęp |

| **Dostęp dla Klienta (Logowanie)** | ✅ Tak | ✅ Tak | ✅ Tak |

| **Własny Branding (Logo + Kolor)** | ❌ Tylko CraftFlow | ✅ Tak | ✅ Tak |

| **Maile systemowe (White-Label)** | ❌ Stopka CraftFlow | ✅ Własny wygląd | ✅ Własny wygląd |

| **Limit zdjęć na projekt** | Max 10 zdjęć | ✅ **Bez limitu** | ✅ **Bez limitu** |

| **Jakość zdjęć w galerii** | Standardowa (kompresja) | Wysoka (HD) | ✨ **Oryginalna (4K)** |

| **Wsparcie techniczne** | E-mail (do 48h) | E-mail (do 24h) | ✨ **Priorytet (Czat)** |

## 4\. ⚙️ Architektura Danych i Stos Technologiczny

Aplikacja opiera się na architekturze bezstanowego serwera i wykorzystuje potężny **Clerk-Firebase Stack**.

- **Frontend & Backend:** Next.js (App Router), React, Tailwind CSS, shadcn/ui.
- **Walidacja Danych:** Zod (Schema validation dla wszystkich Server Actions).
- **Autoryzacja i Subskrypcje:** Clerk + Stripe (Natywna integracja).
- **Baza Danych:** Firebase Firestore (NoSQL).
- **Storage (Pliki):** Firebase Storage.
- **Mailing:** Resend (React Email do szablonów).
- **Infrastruktura:** Vercel (Hosting, Web Analytics, Error Tracking).

### 4.1. Zarządzanie Użytkownikami (Single Source of Truth)

- **Baza Użytkowników:** Brak kolekcji Users w Firebase. Dane Wykonawcy (Imię, Nazwa Firmy, Branding) są trzymane
  wyłącznie w obiekcie publicMetadata w Clerk.
- **Ustawienia Konta:** Brak dedykowanej podstrony /settings. Całe zarządzanie kontem, subskrypcją Stripe i fakturami
  odbywa się w gotowym modalu Clerka (&lt;UserProfile /&gt;).

### 4.2. Struktura Bazy Danych (Firestore)

Kolekcje opierają się na identyfikatorze contractorId.

**Słownik statusów projektów (State Machine):**

- DRAFT _(Szkic)_: Niewidoczny dla klienta. Może zostać trwale usunięty (Hard Delete).
- ACTIVE _(W toku)_: Opublikowany. Przejście w ten stan automatycznie wysyła e-mail do klienta.
- COMPLETED _(Zakończony)_: Oddany. Zamrożony (Read-Only), ląduje w historii.
- ARCHIVED _(Zarchiwizowany)_: Ukryty z głównego widoku Wykonawcy w celach porządkowych.
- DELETED _(Usunięty - Soft Delete)_: Trwale skasowany przez Wykonawcę. Dokument zostaje w bazie (aby nie psuć historii
  klienta), ale zdjęcia są kasowane.

**Główne Kolekcje:**

- /projects \[contractorId, name, status, publicToken, steps\[array\], last_client_view_at\]
- /clients \[contractorId, email, phone, clientAuthId, isRegistered\]
- /templates \[contractorId, name, default_steps\[array\]\]

### 4.3. Zarządzanie Plikami (Firebase Storage)

- **Limity:** Sztywny limit wielkości do **4MB** na zdjęcie (wymóg wydajności Vercel). Odrzucanie z wyraźnym błędem w
  UI.
- **Formaty:** .jpg, .jpeg, .png, .webp, .heic.
- **Katalogi:** /projects/{projectId}/images/{fileName}.

## 5\. 📂 Struktura Routing'u (Next.js App Router)

### 🌐 Strefa Publiczna (Marketing)

- / - Strona główna
- /features - Możliwości systemu
- /pricing - Cennik i FAQ
- /about-us - O nas
- /terms i /privacy - Regulaminy i RODO

### 🔐 Strefa Autoryzacji

- /sign-in i /sign-up - Autoryzacja Clerk
- /onboarding - 5-krokowy kreator konta

### 🛠️ Strefa Wykonawcy (Prefix /app)

- /app/dashboard - Statystyki ogólne
- /app/projects - Tabela aktywnych zleceń
- /app/projects/\[id\] - Szczegóły, oś czasu, wylewanie zdjęć, edycja etapów
- /app/clients - Baza klientów (CRM)
- /app/templates - Szablony etapów
- /app/branding - Ustawienia portalu klienta

### 👀 Strefa Klienta

- /status/\[token\] - Widok Gościa (odczyt bez logowania)
- /client-portal - Dashboard zarejestrowanego Klienta (Zlecenia bieżące i historia)
- /client-portal/\[id\] - Zabezpieczony widok szczegółów

### ⚙️ Backend (API / Webhooks)

- /api/webhooks/clerk - Kaskadowe usuwanie danych po zdarzeniu user.deleted.

## 6\. 📱 Opis Modułów i UX/UI

### 6.1. Proces Onboardingu

Kreator z opcją "Pomiń":

- Dane firmy i branża.
- Branding (Wgrywanie logo i kolorów z Live-Preview).
- Etapy projektów (Definicja pierwszego szablonu).
- E-mail powitalny (Edytor zmiennych {{clientName}}).
- **Ekran Sukcesu:** Generuje **"Demo Projekt"** (isDemo: true), aby zapobiec syndromowi pustego ekranu (Cold Start).

### 6.2. Portal Klienta i Smart Links

- **Gość (/status):** Widzi oś czasu i zdjęcia z brandingiem rzemieślnika. System w tle aktualizuje flagę
  last_client_view_at (Potwierdzenie odczytu dla rzemieślnika). Wyraźne CTA zachęca do rejestracji.
- **Zalogowany (/client-portal):** Widzi kafelki projektów w podziale na "W toku" i "Historia".

## 7\. 🧠 Logika Biznesowa (Business Logic)

### 7.1. Flow Płatności

- 14 dni Premium za darmo po Onboardingu.
- **Kalkulacja Quoty:** Server Action sprawdza w Clerk cykl rozliczeniowy i liczy nowo utworzone projekty (wykluczając
  Demo).
- Blokada przycisku "Dodaj projekt" po przekroczeniu limitu.

### 7.2. Logika Szablonów (Deep Copy)

Przy nowym projekcie wybrane etapy są twardo kopiowane z szablonu. Następnie Wykonawca ma pełną swobodę
dodawania/usuwania etapów w danym zleceniu, bez modyfikacji globalnego szablonu.

### 7.3. Skalowanie PLG (Problem zgubionych e-maili)

Jeśli klient kliknie "Zarejestruj się" z linku dla gościa, link przekazuje w tle jego tymczasowe ID (?invite=abc). Nawet
jeśli klient założy konto używając funkcji "Sign in with Apple" (ukryty email), system rozpozna go, zweryfikuje i
**automatycznie nadpisze jego dane w CRM wykonawcy**.

## 8\. 📧 Matryca Powiadomień (Resend)

| **Wyzwalacz** | **Odbiorca** | **Zawartość / Cel** |

| **Nowe Konto** | Wykonawca | Powitanie, link do panelu i instrukcje. |

| **Trial (T-3 dni)** | Wykonawca | Przypomnienie o podpięciu płatności. |

| **Publikacja Projektu** | Klient | Mail ze "Smart Linkiem" (wyzwalany przy zmianie statusu DRAFT -> ACTIVE). |

| **Zakończenie etapu** | Klient | Informacja o postępach w zleceniu. |

## 9\. 🛡️ Bezpieczeństwo i Obsługa Błędów

### 9.1. Backend i Zod

- Firebase Security Rules całkowicie blokują dostęp od strony klienta (allow read, write: if false;).
- Każda akcja serwerowa (Server Action) w Next.js jest walidowana przez schematy **Zod** i autoryzowana za pomocą sesji
  Clerka (auth().userId).

### 9.2. Edge Cases (Usuwanie danych)

- **Usunięcie DRAFT:** Hard Delete w Firestore i Storage.
- **Usunięcie opublikowanego projektu:** Soft Delete w Firestore (chroni to historię w panelu klienta), ale Hard Delete
  w Storage (usuwa fizycznie zdjęcia dla optymalizacji kosztów).
- **Usunięcie Konta Wykonawcy:** Webhook uruchamia kaskadowe usuwanie (Cascade Delete) wszystkich danych w Firestore i
  Storage (zgodność z RODO).

### 9.3. Optymalizacja Wydajności

- **Paginacja:** Pobieranie danych paczkami (np. limit(20)) zapobiega ogromnym kosztom odczytów w Firebase.
- **Optimistic UI:** Oznaczenie checkboxa etapu zmienia interfejs w 1ms (hak useOptimistic), ignorując opóźnienia sieci
  podczas gdy serwer zapisuje dane w tle.

K"mcpServers": { "stitch": { "type": "http", "url": "https://stitch.googleapis.com/mcp", "headers": { "X-Goog-Api-Key":
"AQ.Ab8RN6LTv1CyrT7XAMZVHCKbtRXi-Kb0ICyQ6jhLAIEOgs99SQ" } } }

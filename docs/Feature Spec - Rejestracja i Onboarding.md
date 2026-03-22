# **🧩 Feature Spec: Rejestracja (Custom UI) i Dynamiczny Onboarding**

**Moduł:** Autoryzacja i Inicjalizacja Konta

**Powiązane trasy:** /sign-up, /sign-in, /onboarding, /onboarding/\[step\]

**Zależności:** Clerk (Hooks API: useSignUp, useSignIn), Supabase (PostgreSQL), Drizzle ORM

## **1\. 🔄 Architektura Przepływu (Auth-then-Gate)**

W systemie rozdzielamy dwa pojęcia:

1. **Tożsamość (Identity):** Zarządzana przez Clerk poprzez autorskie formularze (Custom UI). Założenie konta jest
   zawsze darmowe i bezpieczne.
2. **Dostęp (Authorization/Billing):** Zarządzany mechanizmem subskrypcji Clerk. Dostęp do tras /app/\* wymaga aktywnego
   planu i ukończonego onboardingu.

**Główny Flow Wykonawcy:**

Strona Marketingowa ➡️ Autorski Formularz Rejestracji (/sign-up) ➡️ Przechwycenie Intencji ➡️ Ekran Powitalny (Wybór
Planu Clerk) ➡️ Stepper Konfiguracyjny (stan zapisywany w Supabase w kolumnie JSONB) ➡️ Przekierowanie do
/app/dashboard.

## **2\. 🖥️ Rejestracja (Custom UI) i Przekazywanie Intencji**

Zbudowaliśmy własne formularze rejestracji i logowania oparte na komponentach shadcn/ui, integrując je pod spodem z API
Clerka (hooki useSignUp oraz useSignIn). Daje to pełną kontrolę nad interfejsem.

### **2.1. Przechwytywanie Parametrów (URL Intent)**

Kiedy użytkownik klika przycisk na stronie cennika, przekazujemy jego intencję w adresie URL, np.:

https://craftflow.pl/sign-up?intent=contractor

lub dla klienta z linku PLG:

https://craftflow.pl/sign-up?invite=abc1234

**Logika Custom Formularza (/sign-up):**

1. Komponent formularza odczytuje searchParams podczas montowania.
2. Po wywołaniu signUp.create(...) i weryfikacji tożsamości, aplikacja sprawdza zapisany parametr.
3. **Klient (PLG):** Jeśli parametr to ?invite=..., formularz używa Clerka do zaktualizowania publicMetadata (nadając
   tablicę ról: roles: \["client"\]) i natychmiast wywołuje router.push('/client-portal').
4. **Wykonawca:** Jeśli parametr to intent=contractor (lub go brak), formularz nadaje rolę contractor i przekierowuje
   nowo utworzonego użytkownika do ścieżki /onboarding.

## **3\. 🛤️ Proces Onboardingu Wykonawcy**

Proces dzieli się na wybór planu oraz właściwy konfigurator (Stepper). Aby zachować wydajność i lekki token sesji w
Clerk, cały postęp kreatora zapisywany jest w bazie PostgreSQL.

### **3.1. Mechanizm zapisu stanu w Supabase (JSONB State Persistence)**

W relacyjnej bazie (SQL) formularze wieloetapowe bywają trudne, bo wymagają zapisywania niepełnych danych. Rozwiązujemy
to tworząc tabelę onboarding_state z kolumną JSONB na "brudnopis" formularza.

1. **Inicjalizacja Postępu:** Kiedy użytkownik rozpoczyna onboarding, Server Action używając Drizzle ORM robi UPSERT do
   tabeli onboarding_state. Zapisywany jest tam aktualny URL kroku (np. currentStep: '/onboarding/step-2'). Jeśli
   użytkownik zamknie przeglądarkę i wróci, główny router /onboarding odczyta ten rekord i natychmiast przekieruje go do
   odpowiedniego etapu.
2. **Częściowy Zapis Danych (Partial Save):** Każde kliknięcie "Dalej" wyzwala Server Action, która aktualizuje obiekt
   JSONB o wpisane wartości (np. formData.companyName, formData.industry). Dzięki temu użytkownik nigdy nie traci
   wpisanej treści.

### **FAZA 1: Ekran Powitalny i Wybór Planu (/onboarding/plans)**

Zaraz po utworzeniu konta Wykonawca widzi ekran powitalny.

- **Interfejs:** Estetyczne powitanie oraz karty planów.
- **Akcja:** Kliknięcie w plan inicjuje przypisanie subskrypcji Clerk.
- **Zdarzenie Sukcesu:** Zaktualizowanie statusu w Clerk. Baza SQL aktualizuje rekord w onboarding_state – ustawia
  currentStep na kolejny ekran, np. /onboarding/company-details.

### **FAZA 2: Dynamiczny Stepper Konfiguracyjny**

W tej fazie komponenty Steppera doczytują domyślne wartości wprost ze zsynchronizowanego rekordu w Supabase (parsowanego
z JSONB).

- **Krok 1: Podstawowe Dane Firmy**  
  Formularz (Nazwa firmy, Branża). Kliknięcie "Dalej" dorzuca klucze do obiektu JSONB w bazie i uaktualnia currentStep.
- **Krok 2: Personalizacja Brandingu (WARUNKOWY)**  
  Pojawia się **tylko wtedy**, gdy wybrano plan Standard lub Premium. Wgrywanie Logo do Supabase Storage i wybór koloru.
- **Krok 3: Twój pierwszy szablon**  
  Wpisanie domyślnych kroków (np. 1\. Wycena, 2\. Pomiar...).
- **Krok 4: E-mail powitalny**  
  Określenie domyślnej treści wiadomości dla klienta.

### **Zakończenie Onboardingu (Data Distribution)**

Ostatni przycisk wyzwala najpotężniejszą Server Action (uruchamianą jako transakcja SQL \- db.transaction):

1. Pobiera pełen, gotowy obiekt JSONB z tabeli onboarding_state.
2. **Rozdziela dane** do właściwych, znormalizowanych tabel: tworzy rekord w tabeli branding, dodaje szablon w tabelach
   templates i template_steps.
3. Tworzy powitalny wpis w bazie (Demo Projekt dla Wykonawcy w tabeli projects).
4. **Zamyka proces:** Aktualizuje rekord w onboarding_state: db.update(onboardingState).set({ completed: true,
   completedAt: new Date() }).where(eq(onboardingState.contractorId, userId)). Rekord pozostaje w bazie do celów
   analitycznych i audytu.
5. Aktualizuje token Clerk: publicMetadata: { onboardingComplete: true, roles: \["contractor"\] }.
6. Przekierowuje użytkownika bezpośrednio do /app/dashboard.

## **4\. 🛡️ Ochrona Aplikacji (Next.js Middleware)**

Middleware działający na krawędzi (Edge) jest bardzo lekki. Nie uderza do bazy Supabase. Sprawdza wyłącznie
zweryfikowany kryptograficznie token Clerka, aby zabezpieczyć aplikację. Odsyłaniem do konkretnego kroku zajmuje się
sama strona /onboarding (RSC doczytujący z Supabase).

Logika pliku middleware.ts:

import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";  
import { NextResponse } from "next/server";

export default authMiddleware({  
 publicRoutes: \["/", "/pricing", "/features", "/status/(.\*)", "/api/webhooks(.\*)", "/sign-in(.\*)",
"/sign-up(.\*)"\],

afterAuth(auth, req) {  
 if (\!auth.userId && \!auth.isPublicRoute) {  
 return redirectToSignIn({ returnBackUrl: req.url });  
 }

    const roles \= auth.sessionClaims?.metadata?.roles || \[\];
    const onboardingComplete \= auth.sessionClaims?.metadata?.onboardingComplete;

    const isAppRoute \= req.nextUrl.pathname.startsWith('/app');
    const isOnboardingRoute \= req.nextUrl.pathname.startsWith('/onboarding');

    // 1\. Ochrona tras klienckich
    if (req.nextUrl.pathname.startsWith('/client-portal') && \!roles.includes('client')) {
       return NextResponse.redirect(new URL('/404', req.url));
    }

    // \--- REGUŁY DLA WYKONAWCY (CONTRACTOR) \---
    if (roles.includes('contractor')) {

      // A. Ochrona tras /app (Użytkownik bez ukończonego onboardingu próbuje wejść do apki)
      if (isAppRoute && \!onboardingComplete) {
        return NextResponse.redirect(new URL('/onboarding', req.url));
      }

      // B. Blokada powrotu do onboardingu po jego ukończeniu
      if (isOnboardingRoute && onboardingComplete) {
        return NextResponse.redirect(new URL('/app/dashboard', req.url));
      }
    }

}  
});

## **5\. 🗂️ Struktura Danych i Zarządzanie Stanem**

Dzięki Drizzle ORM utrzymujemy wyraźny podział odpowiedzialności między autoryzacją a danymi procesowymi.

### **5.1. Token Sesji (Clerk publicMetadata)**

Token JWT w Clerk musi być jak najmniejszy.

**Docelowy Token (podczas oraz po zakończeniu procesu):**

{  
 "roles": \["contractor"\],  
 "onboardingComplete": false // Zmieni się na 'true' po zakończeniu dystrybucji danych (SQL Transaction)  
}

### **5.2. Tabela Stanu Onboardingu w Supabase**

W PostgreSQL tworzymy dedykowaną, "brudnopisową" tabelę dla Drizzle ORM. Tabela ta przechowuje zarówno tymczasowe dane
formularzy, jak i ostateczny status przejścia procesu:

import { pgTable, varchar, jsonb, timestamp, boolean } from 'drizzle-orm/pg-core';

export const onboardingState \= pgTable('onboarding_state', {  
 contractorId: varchar('contractor_id', { length: 255 }).primaryKey(), // Clerk ID  
 currentStep: varchar('current_step', { length: 255 }).notNull(),  
 formData: jsonb('form_data').default({}), // Elastyczny JSON dla niekompletnych danych formularzy  
 completed: boolean('completed').default(false).notNull(), // Flaga zakończenia procesu  
 completedAt: timestamp('completed_at'), // Data i czas ukończenia onboardingu  
 updatedAt: timestamp('updated_at').defaultNow().notNull(),  
});

**Przykład wartości przechowywanej w polu formData (w trakcie procesu):**

{  
 "companyName": "Stolarnia u Jana",  
 "industry": "Stolarstwo",  
 "brandingColor": "\#10B981",  
 "logoUrl": null,  
 "templateSteps": \["Wycena", "Pomiary", "Montaż"\]  
}

_(Po zakończeniu onboardingu rekord pozostaje w bazie z completed: true i zapisaną datą completedAt do celów analityki
PLG lub ewentualnego audytu procesów)._

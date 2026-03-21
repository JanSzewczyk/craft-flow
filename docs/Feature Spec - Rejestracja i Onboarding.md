# **🧩 Feature Spec: Rejestracja (Custom UI) i Dynamiczny Onboarding**

**Moduł:** Autoryzacja i Inicjalizacja Konta

**Powiązane trasy:** /sign-up, /sign-in, /onboarding, /onboarding/\[step\]

**Zależności:** Clerk (Hooks API: useSignUp, useSignIn, minimalne publicMetadata), Firestore (Data Profile & Onboarding
State)

## **1\. 🔄 Architektura Przepływu (Auth-then-Gate)**

W systemie rozdzielamy dwa pojęcia:

1. **Tożsamość (Identity):** Zarządzana przez Clerk poprzez własne, autorskie formularze (Custom UI). Założenie konta
   jest zawsze darmowe.
2. **Dostęp (Authorization/Billing):** Zarządzany wbudowanym mechanizmem subskrypcji Clerk. Dostęp do tras /app/\*
   wymaga aktywnego planu i ukończonego onboardingu.

**Główny Flow Wykonawcy:**

Strona Marketingowa ➡️ Autorski Formularz Rejestracji (/sign-up) ➡️ Weryfikacja Roli (Middleware / Formularz) ➡️ Ekran
Powitalny (Wybór Planu Clerk) ➡️ Stepper Konfiguracyjny (stan zapisywany w Firebase) ➡️ Przekierowanie do
/app/dashboard.

## **2\. 🖥️ Rejestracja (Custom UI) i Przekazywanie Intencji**

Zbudowaliśmy własne formularze rejestracji i logowania oparte na komponentach shadcn/ui, integrując je pod spodem z API
Clerka (hooki useSignUp oraz useSignIn). Daje to pełną kontrolę nad wyglądem i zachowaniem formularza.

### **2.1. Przechwytywanie Parametrów (URL Intent)**

Kiedy użytkownik klika przycisk na stronie cennika, przekazujemy jego intencję w adresie URL, np.:

https://craftflow.pl/sign-up?intent=contractor

lub dla klienta z linku PLG:

https://craftflow.pl/sign-up?plan=abc1234

**Logika Custom Formularza (/sign-up):**

Ponieważ formularz jest nasz, musimy ręcznie obsłużyć przekazanie tej intencji dalej po pomyślnym założeniu konta (tzw.
post-sign-up redirect).

1. Komponent formularza odczytuje searchParams podczas montowania.
2. Po wywołaniu np. signUp.create(...) i weryfikacji adresu e-mail (lub OAuth), aplikacja sprawdza zapisany parametr.
3. **Klient (PLG):** Jeśli parametr to ?invite=..., formularz używa Clerka do zaktualizowania publicMetadata (nadając
   tablicę ról z wartością client) i natychmiast wywołuje router.push('/client-portal').
4. **Wykonawca:** Jeśli parametr to intent=contractor (lub go brak), formularz nadaje rolę contractor i przekierowuje
   nowo utworzonego użytkownika do ścieżki /onboarding.

## **3\. 🛤️ Proces Onboardingu Wykonawcy**

Proces dzieli się na wybór planu oraz właściwy konfigurator (Stepper). Aby zachować optymalną wydajność i lekki token
sesji w Clerk, cały postęp kreatora zapisywany jest w bazie danych.

### **3.1. Mechanizm zapisu stanu w Firebase (State Persistence)**

Aby zapobiec utracie danych przy odświeżeniu strony lub zamknięciu przeglądarki, Stepper synchronizuje swój stan z
dedykowanym dokumentem w Firebase:

1. **Inicjalizacja i Zapis Postępu:** Kiedy użytkownik rozpoczyna onboarding, w Firestore tworzony jest tymczasowy
   dokument, np. db.collection('onboarding').doc(userId). Zapisywany jest tam aktualny URL kroku (np. currentStep:
   '/onboarding/step-2'). Jeśli użytkownik zamknie kartę i wróci, główny router /onboarding odczyta ten dokument i
   natychmiast przekieruje go do odpowiedniego etapu.
2. **Częściowy Zapis Danych (Partial Save):** Każde kliknięcie "Dalej" (lub wprowadzanie danych na żywo, np. z użyciem
   debounce) wyzwala Server Action, która aktualizuje obiekt w Firebase o wpisane wartości z formularzy (np.
   formData.companyName, formData.industry). Dzięki temu użytkownik nigdy nie traci wpisanej treści.

### **FAZA 1: Ekran Powitalny i Wybór Planu (/onboarding/plans)**

Zaraz po utworzeniu konta Wykonawca widzi ekran powitalny.

- **Interfejs:** Estetyczne powitanie oraz karty planów.
- **Akcja:** Kliknięcie w plan inicjuje przypisanie subskrypcji Clerk.
- **Zdarzenie Sukcesu:** Zaktualizowanie statusu w Clerk. Dokument w Firebase uaktualnia currentStep na kolejny ekran,
  np. /onboarding/company-details.

### **FAZA 2: Dynamiczny Stepper Konfiguracyjny (Dane z Firebase)**

W tej fazie komponenty Steppera doczytują domyślne wartości wprost ze zsynchronizowanego dokumentu Firestore.

- **Krok 1: Podstawowe Dane Firmy**  
  Zwykły formularz (Nazwa firmy, Branża). Kliknięcie "Dalej" zapisuje dane w Firestore i uaktualnia currentStep.
- **Krok 2: Personalizacja Brandingu (WARUNKOWY)**  
  Pojawia się **tylko wtedy**, gdy wybrano plan Standard lub Premium. Wgrywanie Logo i kolor.
- **Krok 3: Twój pierwszy szablon**  
  Wpisanie domyślnych kroków.
- **Krok 4: E-mail powitalny**  
  Określenie domyślnej treści wiadomości dla klienta.

### **Zakończenie Onboardingu**

Ostatni przycisk wyzwala główną Server Action:

1. Przenosi zebrane dane z tymczasowego dokumentu onboarding/{userId} do właściwych docelowych kolekcji (/branding,
   /templates).
2. Usuwa dokument tymczasowy onboarding/{userId}.
3. Tworzy powitalny wpis w bazie (Demo Projekt dla Wykonawcy).
4. Aktualizuje token Clerk: publicMetadata: { onboardingComplete: true, roles: \["contractor"\] }.
5. Przekierowuje użytkownika bezpośrednio do /app/dashboard.

## **4\. 🛡️ Ochrona Aplikacji (Next.js Middleware)**

Middleware działający na krawędzi (Edge) jest teraz bardzo lekki. Nie sprawdza na jakim etapie jest użytkownik – jego
zadaniem jest tylko zabezpieczenie aplikacji docelowej. Odsyłaniem do konkretnego kroku zajmuje się sama strona
/onboarding na podstawie danych z Firestore.

Logika pliku middleware.ts:

import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";  
import { NextResponse } from "next/server";

export default authMiddleware({  
 // Ścieżki publiczne  
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

      // A. Ochrona tras /app (Użytkownik z nieukończonym onboardingiem próbuje wejść do apki)
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

Dzięki przeniesieniu logiki poszczególnych formularzy do bazy danych, utrzymujemy wyraźny podział odpowiedzialności
między autoryzacją a danymi procesowymi.

### **5.1. Token Sesji (Clerk publicMetadata)**

Token JWT w Clerk musi być jak najmniejszy, dlatego trzyma wyłącznie kluczowe, niezmienne flagi decydujące o autoryzacji
do tras.

**Docelowy Token (podczas oraz po zakończeniu procesu):**

{  
 "roles": \["contractor"\],  
 "onboardingComplete": false // Zmieni się na 'true' po zakończeniu całego procesu  
}

### **5.2. Stan Onboardingu w Firestore**

Wszelkie szczegóły – obecny krok, do którego należy przekierować przy powrocie, oraz wpisane już dane formularzy –
znajdują się w dokumencie w Firebase pod ścieżką np. db.collection('onboarding').doc(userId).

**Przykład dokumentu w Firebase (w trakcie procesu):**

{  
 "currentStep": "/onboarding/branding",  
 "formData": {  
 "companyName": "Stolarnia u Jana",  
 "industry": "Stolarstwo",  
 "brandingColor": "\#10B981",  
 "logoUrl": null  
 },  
 "updatedAt": "2026-03-12T14:30:00Z"  
}

_(Po zakończeniu onboardingu ten dokument może zostać zarchiwizowany lub usunięty na rzecz docelowych wpisów w głównych
kolekcjach)._

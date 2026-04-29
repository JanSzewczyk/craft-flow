# **🧩 Feature Spec: Tworzenie Projektu i Obsługa Klienta**

**Moduł:** Dashboard Wykonawcy \-\> Kreator Projektu

**Powiązane trasy:** /app/projects \-\> /app/projects/\[id\]

**Zależności:** Szablony (/templates), Klienci (/clients), Clerk Backend API

## **1\. 🖥️ Opis Interfejsu (UI/UX)**

Proces tworzenia projektu nie wymaga przechodzenia na osobną podstronę. Odbywa się w kontekście obecnego widoku, co
zapewnia szybkość działania.

- **Wyzwalacz (Trigger):** Główny przycisk CTA \+ Nowy Projekt w prawym górnym rogu na stronie /app/projects (lub skrót
  klawiszowy w Command Palette Cmd+K).
- **Kontener:** Panel boczny typu **Slide-over** (wysuwany z prawej strony ekranu) lub szeroki **Modal** (okno dialogowe
  z przyciemnionym tłem). Używamy gotowych komponentów Sheet lub Dialog z biblioteki shadcn/ui.
- **Pola Formularza:**
  1. Nazwa projektu (Input typu text, wymagany).
  2. Szablon etapów (Select/Dropdown, wymagany. Wyświetla listę szablonów wykonawcy).
  3. Klient (Złożony komponent **Combobox / Autocomplete**).

## **2\. 🔄 Ścieżka Użytkownika (User Flow) i "Magiczny Combobox"**

Najbardziej złożonym elementem UI jest wybór Klienta. Został zaprojektowany tak, aby rzemieślnik nie musiał wcześniej
dodawać klienta w zakładce CRM – wszystko dzieje się w locie.

**Krok 1:** Wykonawca wpisuje nazwę (np. "Zabudowa pod schodami").

**Krok 2:** Z listy rozwijanej wybiera szablon "Zabudowa Meblowa".

**Krok 3:** Wykonawca korzysta z pola "Klient":

- **Scenariusz A (Znany klient):** Wpisuje "Kow...". Combobox od razu podpowiada _Jan Kowalski (jan@kowalski.pl)_.
  Wykonawca klika i klient zostaje przypisany do formularza.

### **2.1. Szczegółowy Flow: Dodawanie Nowego Klienta (Scenariusz B i C)**

**Przypadek użycia (Use Case):** Wykonawca odbiera telefon od nowej osoby i chce natychmiast utworzyć dla niej projekt w
jednym widoku. Wykonawcę nie interesuje, czy ten klient korzystał już z aplikacji u innego rzemieślnika (Scenariusz C) –
z jego perspektywy to po prostu "Nowy klient".

**Flow interfejsu krok po kroku:**

1. **Wyszukiwanie:** Wykonawca wpisuje w pole "Klient" imię i nazwisko nowej osoby (np. "Anna Nowak").
2. **Pusty stan (Empty State):** Combobox nie znajduje dopasowań we własnej bazie (/clients tego wykonawcy) i wyświetla
   opcję: \+ Utwórz klienta: "Anna Nowak".
3. **Akcja rozszerzenia (Expand):** Po kliknięciu, Combobox blokuje wpisaną wartość jako wybraną.
4. **Animacja formularza:** Rozwijają się dwa nowe pola:
   - E-mail Klienta (Wymagany. Walidacja na żywo sprawdza format @).
   - Telefon Klienta (Opcjonalny).
5. **Wypełnienie:** Wykonawca podaje maila.

**Krok 4 (Zakończenie):** Wykonawca klika główny przycisk na dole: **"Utwórz szkic projektu"**. Przycisk zmienia stan na
ładowanie (Spinner / disabled).

## **3\. ⚙️ Logika Backendowa i Baza Danych (Server Actions)**

Gdy użytkownik wyśle formularz, dane trafiają do Server Action (np. createProjectAction).

### **3.1. Walidacja Danych (Zod Schema)**

Serwer weryfikuje paczkę danych przy pomocy biblioteki Zod:

const createProjectSchema \= z.object({  
 name: z.string().min(3).max(100),  
 templateId: z.string().min(1),  
 client: z.object({  
 id: z.string().optional(), // Obecne, jeśli to Scenariusz A (Znany Klient)  
 name: z.string().min(2), // Wymagane zawsze  
 email: z.string().email().optional(), // Wymagane, jeśli 'id' jest puste  
 phone: z.string().optional(),  
 })  
}).refine(data \=\> data.client.id || data.client.email, {  
 message: "E-mail jest wymagany dla nowego klienta.",  
 path: \["client", "email"\]  
});

### **3.2. Operacje na Bazie Danych (Clerk API & Firestore Batch)**

Akcja sprawdza sesję (const { userId } \= auth();). Następuje seria operacji. W przypadku tworzenia nowego klienta,
system inteligentnie weryfikuje jego globalny status (Auto-Linking).

1. **Auto-Linking i Obsługa Nowego Klienta (Flow B i C):**  
   Jeśli client.id nie zostało przesłane, serwer najpierw sprawdza bazę globalną Clerk, korzystając z backendowego SDK
   (clerkClient.users.getUserList({ emailAddress: \[client.email\] })):
   - **Scenariusz C (Klient znany globalnie, nowy w tym CRM):** Jeśli Clerk zwróci użytkownika, serwer dodaje do
     WriteBatch tworzenie dokumentu w /clients wykonawcy:  
     { contractorId: userId, name: "Anna Nowak", email: "anna@test.pl", phone: "...", isRegistered: true, clientAuthId:
     clerkUser.id, createdAt: Timestamp }  
     _(Dzięki temu klient natychmiast zobaczy ten projekt w swoim Portalu po zalogowaniu, bez potrzeby rejestracji)._
   - **Scenariusz B (Zupełnie nowy klient):** Jeśli Clerk zwróci pustą listę (klient nie istnieje w systemie), serwer
     tworzy dokument:  
     { contractorId: userId, name: "Anna Nowak", email: "anna@test.pl", phone: "...", isRegistered: false, clientAuthId:
     null, createdAt: Timestamp }
2. **Kopia Szablonu (Deep Copy):**  
   Serwer pobiera dokument z /templates/{templateId} i przygotowuje do skopiowania jego tablicę default_steps.
3. **Zapis Projektu (Status DRAFT):**  
   Serwer dodaje do transakcji Batch nowy dokument w /projects:  
   { contractorId: userId, clientId: \[wybrane lub nowo wygenerowane ID z pkt 1\], name: "Zabudowa pod schodami",
   status: "DRAFT", publicToken: \[wygenerowany 16-znakowy bezpieczny token\], steps: \[skopiowane kroki\], createdAt:
   Timestamp }
4. **Commit:** batch.commit() zostaje wywołane. Operacja jest w pełni atomowa.

### **3.3. Zakończenie (Redirect)**

Po poprawnym zapisie, front-end natychmiast przekierowuje użytkownika na stronę szczegółów:
router.push('/app/projects/{projectId}'). Wyświetla się Toast "Projekt utworzony pomyślnie\!".

## **4\. 🚨 Edge Cases (Przypadki brzegowe i błędy)**

- **Przekroczony Limit Quota:** Zanim Server Action wykona cokolwiek, odpytuje Clerk o limit. W przypadku przekroczenia,
  zwraca błąd walidacji do UI.
- **Duplikacja E-maila w CRM:** Jeśli wykonawca tworzy nowego klienta podając e-mail, który już istnieje w _jego_ bazie
  /clients (np. zapomniał, że już go dodał), Server Action (przed wywołaniem Clerka) sprawdza istnienie maila w bazie
  Firestore przypisanej do tego contractorId. Jeśli istnieje – przerywa operację z komunikatem: _"Klient z tym adresem
  e-mail już istnieje w Twojej bazie. Wybierz go z listy."_
- **Błędy API Clerka:** W przypadku chwilowej awarii API Clerka (odpytywanie o e-mail z pkt 3.2), system traktuje
  klienta bezpiecznie jako niezarejestrowanego (Scenariusz B), pozwalając rzemieślnikowi dokończyć pracę. Pętla PLG
  (rejestracja z linku) nadpisze te dane później.

## **5\. 🚀 Flow Konwersji (PLG): Rejestracja Nowego Klienta**

Gdy projekt zmienia status z DRAFT na ACTIVE, do klienta ze Scenariusza B leci e-mail z ukrytym parametrem, np.:
https://craftflow.pl/status/\[publicToken\]?invite=\[clientId\].

Po kliknięciu "Załóż konto" w widoku Gościa, parametr jest przekazywany do formularza rejestracji Clerka. Po udanej
rejestracji i weryfikacji maila uruchamia się webhook, który aktualizuje bazę Firestore:

- System znajduje dokument w /clients po clientId i mutuje go:
  - isRegistered: Zmienia na true.
  - clientAuthId: Zapisuje nowe UID z Clerka.
  - email: **Nadpisuje** adres na faktycznie zweryfikowany w Clerk (ochrona przed Apple Private Relay).
- **Brak zmian w kolekcji /projects:** Ponieważ projekty odnoszą się tylko do clientId, aktualizacja samego profilu
  klienta automatycznie spina całą jego historię w Portalu Klienta.

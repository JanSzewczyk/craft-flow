# **🧩 Feature Spec: Portal Klienta i Mechanika PLG (Product-Led Growth)**

**Moduł:** Strefa Klienta (Widok Gościa i Dashboard)

**Domena (DDD):** src/features/client-portal

**Powiązane trasy:** /status/\[token\], /client-portal, /client-portal/\[id\]

**Zależności:** Supabase (PostgreSQL), Drizzle ORM, Supabase Storage, Clerk Auth

**Zgodność:** PRD Master v5.0

## **1\. 🖥️ Opis Interfejsu (UI/UX) i Nawigacji**

Strefa klienta dzieli się na dwa odrębne doświadczenia: dla Gościa (niezalogowanego) oraz dla Zarejestrowanego
Użytkownika.

### **1.1. Widok Gościa (/status/\[token\])**

To wizytówka rzemieślnika. Ten widok musi być "czysty", szybki i budować maksymalne zaufanie.

- **Branding:** Zamiast domyślnego wyglądu CraftFlow, w lewym górnym rogu pojawia się logo Wykonawcy, a interfejs używa
  jego koloru wiodącego (dane pobrane z tabeli contractor_profile).
- **Układ:** Jednokolumnowy, wycentrowany (skupiony na treści, Mobile-First).
  - Nagłówek: "Twój projekt: \[Nazwa projektu\]" i duży badge ze statusem (np. 🟢 W toku).
  - **Oś Czasu (Read-Only):** Pionowa lista etapów. Etapy zakończone są podświetlone (z datą), etapy przyszłe
    wyszarzone.
  - **Załączniki:** Siatka lub prosta lista plików ze zdjęciami i umowami (z opcją pobrania). Miniatury ładują się przez
    URL Supabase z transformacją (np. ?width=400).
- **Silnik PLG (Authwall):** Na dole osi czasu (oraz jako przycisk "Sticky" na telefonach) znajduje się sekcja
  zachęcająca do rejestracji:_"Chcesz zachować ten projekt na zawsze i mieć do niego dostęp z każdego urządzenia? Załóż
  darmowe konto klienta."_ \-\> Przycisk Zapisz projekt.

### **1.2. Panel Zalogowanego Klienta (/client-portal)**

Po założeniu konta, klient zyskuje dostęp do swojego prywatnego centrum dowodzenia.

- **Layout:** Prosty Sidebar z logo CraftFlow (lub górny Topbar na mobile) i dwiema zakładkami: "Moje Projekty" oraz
  "Ustawienia Konta" (otwiera modal Clerk).
- **Widok Główny:** Kafelki (Cards) projektów podzielone na dwa widoki (Tabs):
  - Aktywne (Projekty w statusie ACTIVE).
  - Historia (Projekty w statusie COMPLETED i ARCHIVED).
- **Karta Projektu:** Pokazuje miniaturę (pierwsze zdjęcie z Supabase Storage), nazwę, status, nazwę firmy Wykonawcy i
  pasek postępu (np. "3/5 etapów").
- Kliknięcie w kartę przenosi do /client-portal/\[id\] (Widok niemal identyczny jak u Gościa, ale wzbogacony o globalną
  nawigację wewnątrz portalu).

## **2\. 🛡️ Model Danych i Bezpieczeństwo (Data Mock Object)**

Bezpieczeństwo Widoku Gościa to najwyższy priorytet. Link z tokenem (np. /status/aB3x9Zp) jest publiczny. Haker lub
niepowołana osoba nie może wyciągnąć z niego prywatnych notatek Wykonawcy.

### **2.1. Server Action: getProjectByPublicToken**

Ta akcja działa bez weryfikacji sesji w Clerk. Używamy Drizzle ORM, aby "wyciągnąć" z bazy tylko bezpieczny podzbiór
danych (tzw. DMO \- Data Mock Object).

**Zasada działania DMO w SQL:** Zamiast pobierać cały rekord SELECT \*, precyzyjnie wybieramy kolumny. Wykonujemy
relacyjne złączenia (JOIN), aby dociągnąć logo wykonawcy bez pobierania jego prywatnych danych rozliczeniowych.

// Przykład użycia Drizzle ORM do DMO:  
const projectDMO \= await db  
 .select({  
 id: projects.id,  
 name: projects.name,  
 status: projects.status,  
 contractorName: contractorProfile.companyName,  
 brandColor: contractorProfile.brandColor,  
 logoUrl: contractorProfile.logoUrl,  
 })  
 .from(projects)  
 .innerJoin(contractorProfile, eq(projects.contractorId, contractorProfile.id))  
 .where(  
 and(  
 eq(projects.publicToken, token),  
 inArray(projects.status, \['ACTIVE', 'COMPLETED', 'ARCHIVED'\]) // DRAFT jest ukryty\!  
 )  
 )  
 .limit(1);

// W kolejnych zapytaniach pobieramy tylko publiczne kroki (projectSteps)  
// i bezpieczne załączniki (attachments).

## **3\. 🚀 Mechanika PLG: Relacyjne Auto-Scalanie Kont**

To najważniejszy proces automatyzacji w aplikacji. Łączy tożsamość "Gościa" z rekordami w bazie (tabela clients u
różnych wykonawców) korzystając z potęgi SQL.

### **Krok 1: Przekazanie intencji (URL Param)**

E-mail wysłany do niezarejestrowanego klienta zawiera Smart Link:

https://craftflow.pl/status/\[publicToken\]?invite=\[clientId\]

Parametr invite zawiera UUID rekordu z tabeli clients.

### **Krok 2: Rejestracja (Clerk)**

Kiedy Gość klika "Zarejestruj się", frontend przenosi go do /sign-up, zachowując parametr w searchParams. Klient zakłada
darmowe konto.

### **Krok 3: Synchronizacja i Masowe Scalanie (SQL UPDATE)**

Po udanej rejestracji i wejściu na /client-portal, uruchamia się Server Action. Ponieważ klient mógł w przeszłości brać
udział w innych projektach (u innych rzemieślników), system aktualizuje **wszystkie** powiązane z nim rekordy CRM jednym
zapytaniem SQL.

// Drizzle ORM \- Masowe scalanie kont klienta:  
await db.update(clients)  
 .set({  
 clerkUserId: currentUser.id, // Nowe, globalne UID z Clerk  
 email: currentUser.emailAddresses\[0\].emailAddress // Wymuszenie zweryfikowanego e-maila (np. po logowaniu Apple)  
 })  
 .where(  
 or(  
 eq(clients.id, inviteId), // 1\. Scal rekord z konkretnego zaproszenia  
 eq(clients.email, currentUser.emailAddresses\[0\].emailAddress) // 2\. Scal WSZYSTKIE historyczne rekordy u innych
wykonawców po e-mailu  
 )  
 );

### **Krok 4: Pobieranie projektów dla Zalogowanego Klienta**

Dzięki relacyjnej bazie, w widoku /client-portal wystarczy proste złączenie tabel (JOIN), aby wyświetlić klientowi
wszystkie jego zlecenia od wszystkich wykonawców:

const clientProjects \= await db  
 .select({  
 id: projects.id,  
 name: projects.name,  
 status: projects.status,  
 contractorName: contractorProfile.companyName  
 })  
 .from(projects)  
 .innerJoin(clients, eq(projects.clientId, clients.id))  
 .innerJoin(contractorProfile, eq(projects.contractorId, contractorProfile.id))  
 .where(eq(clients.clerkUserId, auth().userId)); // auth().userId z Clerk

## **4\. 🚨 Edge Cases i Błędy**

- **Wygasły/Błędny Token LUB Status DRAFT:** Próba wejścia na błędny link lub link do projektu w fazie "Szkic" renderuje
  ładny komponent \<ProjectNotFound /\> z ilustracją (nie zdradzając, czy projekt istnieje, ale jest ukryty).
- **Próba rejestracji przez klienta, który już ma konto:** Jeśli klient kliknie "Załóż konto", ale w Clerku wybierze
  "Zaloguj się", system i tak przechwyci parametr ?invite=, zaktualizuje tabelę clients i połączy nowe zlecenie z jego
  istniejącym kontem globalnym.
- **Brak parametru invite:** Jeśli ktoś wejdzie prosto z ulicy na craftflow.pl i założy konto klienta, zostanie
  wpuszczony do /client-portal, ale jego tablica projektów będzie pusta z komunikatem: _"Nie masz jeszcze żadnych
  projektów. Skontaktuj się ze swoim rzemieślnikiem, aby przypisał Twój e-mail do zlecenia."_
- **Śledzenie aktywności (Potwierdzenie odczytu):** Wywołanie widoku /status/\[token\] uruchamia w tle cichą Server
  Action, która z użyciem techniki Throttle aktualizuje flagę lastClientViewAt w tabeli projects:  
  await db.update(projects)  
   .set({ lastClientViewAt: new Date() })  
   .where(eq(projects.publicToken, token));

# **🧩 Feature Spec: Baza Klientów (CRM)**

**Moduł:** Zarządzanie relacjami z klientami

**Domena (DDD):** src/features/crm

**Powiązane trasy:** /app/clients

**Zależności:** Supabase (PostgreSQL), Drizzle ORM, Zod, shadcn/ui (Data Table, Dialog)

## **1\. 🖥️ Odczyt (Read): Widok Głównej Tabeli**

Główny ekran domeny CRM (/app/clients) to interaktywna tabela danych zbudowana z użyciem TanStack Table (przez
shadcn/ui).

### **1.1. Dane w Tabeli**

Tabela wyświetla listę wszystkich klientów przypisanych do danego Wykonawcy.

- **Kolumny:** Imię i Nazwisko / Firma, E-mail, Telefon, Data dodania, Status Konta PLG (Zwykły tag/badge wskazujący,
  czy ten klient założył już darmowe konto w CraftFlow \- na podstawie pola clerkUserId).
- **Akcje:** Wyszukiwarka tekstowa (filtrowanie po imieniu lub e-mailu), paginacja (np. 10 wyników na stronę).

## **2\. ➕ Tworzenie Klienta (Create)**

Dodawanie klienta może odbywać się na dwa sposoby: z poziomu widoku /app/clients (główny przycisk "Dodaj klienta") oraz
skrótem z poziomu tworzenia nowego projektu (Faza 5).

### **2.1. Formularz i Walidacja (Zod)**

Wyświetlany w oknie modalnym (komponent Dialog z shadcn).

- **Pola:** \* Imię i Nazwisko (Wymagane, min. 2 znaki)
  - Adres E-mail (Wymagane, walidacja formatu email) \- _Kluczowe dla mechaniki łączenia kont PLG._
  - Numer telefonu (Opcjonalne, walidacja formatu)
- **UX:** Przycisk "Zapisz" z ikoną ładowania (pending state) podczas wywoływania Server Action.

### **2.2. Server Action (createClient)**

Funkcja na backendzie (Next.js Server Action):

1. Weryfikuje sesję rzemieślnika (auth().userId).
2. Sprawdza schemat wprowadzonych danych (Zod).
3. Robi INSERT do tabeli clients w Supabase, ustawiając contractorId.
4. Wywołuje revalidatePath('/app/clients') aby natychmiast odświeżyć widok tabeli.

## **3\. ✏️ Edycja Klienta (Update)**

Uruchamiana z menu kontekstowego (tzw. "trzy kropki" na końcu wiersza w tabeli) \-\> "Edytuj dane".

- **Interfejs:** Otwiera ten sam modal Dialog co przy tworzeniu, ale wstępnie wypełniony danymi wybranego klienta
  (defaultValues w react-hook-form).
- **Zabezpieczenie E-maila:** Jeśli klient posiada już założone konto w portalu gościa (pole clerkUserId nie jest
  puste), system może opcjonalnie **zablokować edycję adresu e-mail** (lub wygenerować ostrzeżenie), ponieważ adres ten
  jest już weryfikowany i powiązany z tożsamością w Clerk.
- **Server Action (updateClient):** Weryfikuje auth().userId oraz upewnia się (przez WHERE id \= clientId AND
  contractorId \= userId), że wykonawca modyfikuje tylko swojego klienta.

## **4\. 🗑️ Usuwanie i Ochrona Relacyjna (Delete)**

To najbardziej newralgiczna część systemu ze względu na spójność bazy danych.

### **4.1. Ochrona "Sierot" (Orphan Protection)**

W schemacie bazy danych tabela projects posiada regułę ON DELETE RESTRICT w stosunku do tabeli clients. Oznacza to, że
baza Supabase fizycznie odmówi usunięcia klienta, jeśli jest do niego przypisany choć jeden projekt.

### **4.2. UX Usuwania (Frontend)**

1. Użytkownik klika "Usuń" w menu kontekstowym wiersza.
2. Pojawia się Modal Potwierdzenia (komponent AlertDialog z shadcn) z ostrzeżeniem: _"Czy na pewno chcesz usunąć klienta
   \[Imię\]? Tej operacji nie można cofnąć."_
3. Wywołanie Server Action (deleteClient).

### **4.3. Server Action i Obsługa Błędów**

Funkcja deleteClient musi zostać zapakowana w blok try...catch:

try {  
 // Próba usunięcia klienta  
 await db.delete(clients).where(  
 and(  
 eq(clients.id, clientId),  
 eq(clients.contractorId, userId)  
 )  
 );  
 revalidatePath('/app/clients');  
 return { success: true };  
} catch (error: any) {  
 // Błąd klucza obcego (Foreign Key Constraint)  
 if (error.code \=== '23503') { // Kod błędu PostgreSQL dla naruszenia relacji  
 return {  
 success: false,  
 message: "Nie możesz usunąć tego klienta, ponieważ posiada on przypisane projekty. Najpierw usuń lub zarchiwizuj jego
projekty."  
 };  
 }  
 return { success: false, message: "Wystąpił błąd podczas usuwania." };  
}

### **4.4. Informacja Zwrotna (Toast)**

Po otrzymaniu odpowiedzi z Server Action, frontend wyświetla odpowiedni Toast (sukces na zielono, lub błąd z czytelnym,
przetłumaczonym na polski komunikatem ostrzegawczym o powiązanych projektach).

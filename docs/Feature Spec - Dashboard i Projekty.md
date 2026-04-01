# **🧩 Feature Spec: Dashboard i Zarządzanie Projektami**

**Moduł:** Strefa Wykonawcy \-\> Lista Projektów i Statystyki

**Powiązane trasy:** /app/dashboard, /app/projects

**Zależności:** Firestore (/projects), Clerk (Biling/Limity), Firebase Storage (przy usuwaniu)

## **1\. 🖥️ Opis Interfejsu (UI/UX) i Nawigacji**

Moduł ten składa się z dwóch powiązanych ze sobą widoków, które pozwalają na zarządzanie portfelem zleceń.

### **1.1. Widok Ogólny (/app/dashboard)**

Widok powitalny (Overview) dający rzemieślnikowi błyskawiczny wgląd w stan jego biznesu.

- **Karty KPI (Top):**
  - Aktywne projekty (np. 12 w toku).
  - Zakończone w tym miesiącu (np. 4).
  - Wykorzystany limit (Quota) (np. 3/5 projektów \- z mini paskiem postępu). Jeśli limit zbliża się do końca, karta ma
    żółty/czerwony akcent i przycisk "Zwiększ limit".
- **Szybki start:** Duży przycisk CTA \+ Nowy projekt (otwiera kreator opisany w _feature_spec_project_creation_).
- **Ostatnia aktywność (Recent):** Lista 5 ostatnio modyfikowanych lub przeglądanych przez klientów projektów (szybki
  powrót do pracy).

### **1.2. Widok Tabeli Projektów (/app/projects)**

Główne miejsce pracy operacyjnej, oparte na zaawansowanej tabeli danych (shadcn/ui Data Table \+ TanStack Table).

- **Nawigacja (Zakładki/Tabs):** Służą do szybkiego filtrowania po statusie zdefiniowanym w PRD:
  - Wszystkie (domyślny widok)
  - Szkice (DRAFT)
  - W toku (ACTIVE)
  - Zakończone (COMPLETED)
  - Archiwum (ARCHIVED)
- **Kolumny Tabeli:**
  1. Nazwa projektu (Kliknięcie przenosi do /app/projects/\[id\]).
  2. Klient (Imię i nazwisko).
  3. Status (Kolorowy Badge: Szary dla Szkicu, Zielony dla W toku, Niebieski dla Zakończonego).
  4. Postęp (Wizualny pasek, np. 3/5 etapów \- wyliczany z tablicy steps).
  5. Ostatnio widziany (Data last_client_view_at lub "Nigdy").
  6. Akcje (Menu "Trzy kropki").

## **2\. ⚙️ Mechanika Akcji (Row Actions)**

Menu kontekstowe (Trzy kropki) w każdym wierszu tabeli różni się w zależności od statusu projektu:

1. **Dla DRAFT:**
   - Edytuj (Przejście do szczegółów).
   - Opublikuj (Zmienia status na ACTIVE, wyzwala e-mail do klienta).
   - Usuń całkowicie (Hard Delete).
2. **Dla ACTIVE:**
   - Kopiuj link dla klienta.
   - Oznacz jako Zakończony (Przenosi do COMPLETED).
   - Usuń projekt (Soft Delete dla frontendu klienta, Hard Delete plików).
3. **Dla COMPLETED:**
   - Przenieś do Archiwum (Zmienia status na ARCHIVED \- ukrywa z głównych widoków wykonawcy w celu zachowania porządku,
     ale klient nadal widzi to w swoim portalu).

## **3\. 🛡️ Logika Backendowa (Server Actions i Firebase)**

### **3.1. Optymalizacja Pobierania (Paginacja Firestore)**

Aby nie zabić kosztów bazy danych (Firebase Billing), tabela **nie pobiera** wszystkich projektów naraz.

- Wykorzystujemy zapytanie z limit(15) oraz startAfter(lastVisible).
- **Filtrowanie:** Przełączanie zakładek (Tabs) wysyła do serwera parametr filtrujący (np. where("status", "==",
  "ACTIVE")), co zwraca tylko odpowiednie dokumenty.
- Zwracane dane są "odchudzane" (nie pobieramy pełnej subkolekcji załączników do widoku tabeli, sprawdzamy tylko długość
  tablicy steps i ile z nich ma isCompleted: true).

### **3.2. Zarządzanie Limitem Quota (Miesięczny cykl)**

Karta KPI "Wykorzystany limit" działa w oparciu o obiekt sesji Clerka:

1. Serwer odpytuje Clerk o ramy czasowe obecnego cyklu subskrypcji wykonawcy (np. od 1 marca do 31 marca).
2. Wykonuje zapytanie liczące (Count Query) w Firebase: Ile projektów utworzył ten contractorId w przedziale czasu od 1
   do 31 marca, gdzie isDemo \== false.
3. Zwraca wynik na frontend (np. 4/5). Dzięki użyciu zapytania liczącego (Count), Firebase kasuje nas tylko za 1 odczyt,
   a nie za odczyt wszystkich dokumentów\!

### **3.3. Algorytm Usuwania (Zgodnie z PRD v4.9)**

Akcja deleteProjectAction(projectId) realizuje wytyczne bezpieczeństwa Danych:

// Pseudokod logiki usunięcia  
const project \= await db.collection('projects').doc(projectId).get();

if (project.status \=== 'DRAFT') {  
 // HARD DELETE  
 await storage.deleteDirectory(\`/projects/${projectId}/images\`);  
 await db.collection('projects').doc(projectId).delete();

} else {  
 // SOFT DELETE BAZY, HARD DELETE PLIKÓW (ACTIVE, COMPLETED, ARCHIVED)  
 await storage.deleteDirectory(\`/projects/${projectId}/images\`);

// Zmiana statusu na DELETED, aby klient zobaczył odpowiedni komunikat w swoim Portalu  
 await db.collection('projects').doc(projectId).update({  
 status: 'DELETED',  
 steps: \[\] // Czyszczenie osi czasu (oszczędność miejsca)  
 });  
}

## **4\. 🚨 Edge Cases i Błędy**

- **Pusty Stan (Empty State):** Jeśli użytkownik wejdzie w zakładkę "Archiwum" i nie ma tam projektów, zamiast pustej
  tabeli wyświetlana jest ładna ilustracja z tekstem: _"Brak zarchiwizowanych projektów."_
- **Błąd połączenia / Firebase Timeout:** Jeśli podczas próby zmiany statusu (np. Archiwizacji) wystąpi błąd sieci,
  Optimistic UI natychmiast przywraca wiersz do tabeli i wyświetla Toast: _"Nie udało się zarchiwizować projektu.
  Spróbuj ponownie."_
- **Concurrency (Wielu pracowników):** Jeśli wykonawca ma aplikację otwartą na komputerze domowym i telefonie w
  warsztacie, odhaczenie projektu jako "Zakończony" na telefonie powinno płynnie (dzięki Firebase onSnapshot lub
  rewalidacji ścieżki w Next.js) usunąć projekt z zakładki "W toku" na ekranie komputera.

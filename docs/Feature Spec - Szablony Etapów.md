# **🧩 Feature Spec: Zarządzanie Szablonami Etapów**

**Moduł:** Dashboard Wykonawcy \-\> Szablony

**Powiązane trasy:** /app/templates

**Zależności:** Firestore (/templates), Clerk (Weryfikacja Planów/Limitów)

## **1\. 🖥️ Opis Interfejsu (UI/UX) i Nawigacji**

Moduł zarządzania szablonami został zaprojektowany w oparciu o prostotę i mechanikę Drag & Drop (Przeciągnij i Upuść).
Zamiast tworzyć osobne podstrony dla każdego szablonu, wszystko odbywa się na jednym ekranie z wykorzystaniem paneli
bocznych.

### **1.1. Widok Główny (/app/templates)**

- **Nagłówek:** Tytuł "Moje Szablony" oraz wskaźnik limitu (np. "Wykorzystano 2/10 szablonów").
- **Główny Przycisk (CTA):** \+ Utwórz nowy szablon. Jeśli limit planu (Quota) jest wyczerpany, przycisk jest wyszarzony
  (disabled) z małą ikoną kłódki i tooltipem zachęcającym do zmiany planu (Upgrade).
- **Siatka Szablonów (Grid):** Każdy szablon wyświetla się jako karta (Card).
  - _Tytuł szablonu_ (np. "Kompleksowy Remont Łazienki").
  - _Liczba kroków_ (np. "8 etapów").
  - _Podgląd (Mini-lista):_ Pierwsze 3 kroki wypisane małym, szarym drukiem (np. _1\. Projekt 3D, 2\. Wyburzenia, 3\.
    Hydraulika..._).
  - _Menu Kontekstowe:_ Edytuj, Duplikuj, Usuń.

### **1.2. Edytor Szablonu (Slide-over / Panel Boczny)**

Otwiera się po kliknięciu "Utwórz" lub "Edytuj".

- **Nazwa Szablonu:** Duże pole tekstowe na samej górze.
- **Lista Kroków (Drag & Drop):** Wykorzystanie biblioteki np. @dnd-kit/core. Każdy wiersz na liście ma po lewej stronie
  "uchwyt" (sześć kropek) do przeciągania.
- **Edycja Kroku:** W wierszu znajduje się pole tekstowe z nazwą kroku. Użytkownik może pisać bezpośrednio w nim.
- **Dodawanie:** Przycisk \+ Dodaj kolejny etap na samym dole listy.
- **Zapis:** Główny przycisk na dole panelu Zapisz szablon.

## **2\. 🗂️ Model Danych (Firestore)**

Kolekcja /templates przechowuje gotowe "przepisy" na projekty.

**Kluczowa uwaga architektoniczna:** Dokumenty tutaj nie są połączone relacyjnie z aktywnymi projektami\!

interface Template {  
 id: string;  
 contractorId: string; // ID właściciela (rzemieślnika)  
 name: string; // np. "Zabudowa Kuchenna"  
 default_steps: Array\<{  
 id: string; // tymczasowe ID (np. nanoid) potrzebne dla kluczy w React i mechaniki Drag\&Drop  
 title: string;  
 description?: string; // Opcjonalna wskazówka  
 order: number; // Pozycja na liście  
 }\>;  
 createdAt: Date;  
 updatedAt: Date;  
}

## **3\. 🔄 Ścieżka Użytkownika i Logika Backendowa**

### **3.1. Zasada "Głębokiej Kopii" (Deep Copy)**

Najważniejsza reguła biznesowa tego modułu: **Zmiana szablonu nie wpływa na istniejące projekty.**

- Kiedy wykonawca tworzy nowy projekt (zob. _feature_spec_project_creation_), system robi dokładną kopię tablicy
  default_steps i wkleja ją do dokumentu projektu.
- Jeśli rzemieślnik dzisiaj wejdzie do szablonu "Kuchnia" i dopisze krok "Zamówienie blatu", to zaktualizuje się tylko
  dokument w /templates. Wszystkie historyczne i trwające projekty kuchenne pozostaną nienaruszone.

### **3.2. Walidacja Limitów i Paywall (Server Actions)**

Gdy użytkownik wysyła formularz (Server Action saveTemplateAction), serwer absolutnie nie ufa frontendowi:

1. Sprawdza sesję i plan subskrypcji w Clerk (auth().sessionClaims.stripePlan).
2. Jeśli to akcja "Utwórz nowy", wykonuje szybkie zapytanie zliczające (COUNT) istniejące szablony tego użytkownika.
3. Jeśli użytkownik ma plan Basic (limit 2\) i ma już w bazie 2 szablony, Server Action rzuca błędem: Zwiększ plan, aby
   dodać więcej szablonów.
4. Frontend przechwytuje ten błąd i wyświetla okno (Modal) z ofertą Upgrade'u.

### **3.3. Optymalizacja UI podczas Edycji (Optimistic Updates)**

Ze względu na mechanikę Drag & Drop, stan listy kroków musi być trzymany lokalnie (useState / useReducer lub w
formularzu typu react-hook-form).

- Serwer jest powiadamiany o nowej kolejności dopiero w momencie kliknięcia **"Zapisz szablon"**.
- Na backend leci cała, posortowana tablica default_steps, która jednym atomowym poleceniem update() nadpisuje starą
  tablicę w Firestore.

### **3.4. Funkcja "Duplikuj"**

Ponieważ rzemieślnicy często mają bardzo podobne procesy (np. "Kuchnia MDF" i "Kuchnia Drewno" różnią się tylko dwoma
etapami), kliknięcie "Duplikuj" na karcie szablonu natychmiast:

1. Uruchamia Server Action z templateId do skopiowania.
2. Odpytuje Clerk o limit Quota.
3. Tworzy nowy dokument z nazwą \[Kopia\] Kuchnia MDF.

## **4\. 🚨 Edge Cases i Błędy**

- **Pusty szablon:** Próba zapisania szablonu bez nazwy lub z zerową liczbą etapów jest blokowana przez walidację Zod na
  frontendzie (wymagane min. 1 etap o dł. znaków \> 2).
- **Usuwanie jedynego szablonu:** Jeśli wykonawca usunie wszystkie swoje szablony (0/10), to przy próbie utworzenia
  Nowego Projektu system wymusi na nim ręczne wpisywanie kroków (co może być frustrujące). Dlatego usunięcie ostatniego
  szablonu powinno wyświetlić ostrzeżenie: _"Uwaga: To Twój ostatni szablon. Tworzenie nowych projektów będzie wymagało
  ręcznego wpisywania etapów."_
- **Długie nazwy etapów:** Formularz limituje długość nazwy etapu (np. do 80 znaków), aby zachować czytelność UI zarówno
  w edytorze, jak i później na docelowej Osi Czasu u klienta mobilnego.

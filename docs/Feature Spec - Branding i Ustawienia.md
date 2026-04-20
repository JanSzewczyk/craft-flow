# **🧩 Feature Spec: Branding i Ustawienia Konta**

**Moduł:** Dashboard Wykonawcy \-\> Branding / Ustawienia

**Powiązane trasy:** /app/branding, /app/settings

**Zależności:** Firestore (/branding/{userId}), Firebase Storage (Logo), Clerk (\<UserProfile /\>)

## **1\. 🖥️ Opis Interfejsu (UI/UX) i Nawigacji**

Ten moduł składa się z dwóch oddzielnych podstron, które pełnią zupełnie inne role w architekturze systemu.

### **1.1. Widok Ustawień Konta i Płatności (/app/settings)**

Zgodnie z zasadą "Single Source of Truth", nie budujemy własnych formularzy do zmiany hasła czy zarządzania subskrypcją.

- **Zawartość:** Strona zawiera wyłącznie osadzony komponent \<UserProfile /\> z biblioteki @clerk/nextjs.
- **Wygląd:** Komponent ten przejmuje na siebie pełne UI (w tym zmianę awatara, e-maila, hasła, połączonych kont
  Google/Apple) oraz posiada zakładkę "Subskrypcja", w której integruje się z portalem klienta Stripe do pobierania
  faktur i zmiany planów.

### **1.2. Widok Brandingu Portalu Klienta (/app/branding)**

To miejsce, w którym wykonawca personalizuje to, co widzi jego Klient. Interfejs jest podzielony na dwie sekcje
(desktop) lub wyświetla się jedna pod drugą (mobile).

**Sekcja Lewa (Formularze edycji):**

- **Podstawowe dane:**
  - Nazwa Firmy (Input, np. "Stolarnia u Jana").
  - Branża (Select, np. "Stolarstwo").
- **Identyfikacja wizualna:**
  - Logo (Komponent Drag & Drop). Pokazuje obecne logo z przyciskiem "Zmień" lub "Usuń".
  - Kolor wiodący (Color Picker \+ lista predefiniowanych, sprawdzonych palet Tailwind np. Zinc, Slate, Blue, Emerald).
    Kolor ten będzie tłem dla głównego badge'a i przycisków w Portalu Klienta.
- **Komunikacja:**
  - Domyślna wiadomość powitalna (Textarea). Wyposażona w pomocnicze "Pills" ze zmiennymi do kliknięcia (np.
    {{clientName}}, {{projectName}}, {{projectLink}}).
- **Akcje:** Główny przycisk na dole Zapisz zmiany (reagujący na stan isDirty \- aktywny tylko gdy użytkownik coś
  zmienił).

**Sekcja Prawa (Live Preview):**

- **Interaktywny podgląd:** "Kopia" widoku Gościa (/status), wyrenderowana w skali (np. w stylizowanej ramce telefonu
  komórkowego). Zmiana koloru lub nazwy firmy w formularzu po lewej natychmiast (onChange) aktualizuje wygląd "telefonu"
  po prawej stronie, zachęcając wykonawcę do personalizacji.

## **2\. 🗂️ Model Danych (Firestore)**

Kolekcja /branding przechowuje jeden dokument na każdego rzemieślnika. ID dokumentu jest równe contractorId (czyli
userId z Clerk).

interface BrandingRecord {  
 contractorId: string; // Używane również jako ID dokumentu (doc.id)  
 companyName: string;  
 industry: string;  
 color: string; // Heksadecymalny kod koloru (np. "\#10B981")  
 logoUrl: string | null; // Publiczny URL do Firebase Storage  
 defaultEmailMessage: string;  
 updatedAt: Date;  
}

## **3\. 🔄 Ścieżka Użytkownika i Logika Backendowa**

### **3.1. Pobieranie Danych (Data Fetching)**

- Widok /app/branding jest komponentem serwerowym (RSC), który bezpośrednio wewnątrz bloku asynchronicznego pobiera
  dokument z Firestore: db.collection('branding').doc(userId).get().
- Ze względu na relatywnie rzadkie zmiany w tym dokumencie, możemy tutaj z powodzeniem stosować Data Caching (Next.js
  Cache) z rewalidacją po wysłaniu formularza zapisu.

### **3.2. Walidacja Danych (Zod)**

Przed wysłaniem zmian na serwer, formularz musi przejść ścisłą weryfikację.

const updateBrandingSchema \= z.object({  
 companyName: z.string().min(2, "Nazwa firmy jest za krótka").max(50),  
 industry: z.string().min(2),  
 color: z.string().regex(/^\#(\[A-Fa-f0-9\]{6}|\[A-Fa-f0-9\]{3})$/, "Nieprawidłowy format koloru"),  
 defaultEmailMessage: z.string().min(10, "Wiadomość jest zbyt krótka").max(1000),  
 // Plik logo jest walidowany i wysyłany osobnym kanałem (FormData)  
});

### **3.3. Logika zapisu pliku Logo (Optymalizacja Kosztów Storage)**

Gdy rzemieślnik wgrywa nowe logo, Server Action (updateBrandingAction) musi zadbać o porządek w chmurze, aby nie trzymać
50 nieużywanych wersji logo tego samego rzemieślnika:

1. **Weryfikacja formatu:** image/png, image/jpeg, image/webp. Max **2MB**.
2. **Hard Delete starego logo:** Serwer pobiera obecny logoUrl z bazy. Jeśli istnieje, wykonuje polecenie usunięcia
   starego pliku z Firebase Storage (korzystając z wyciągniętej z URL'a ścieżki).
3. **Upload nowego:** Wgrywa nowy plik z unikalną nazwą (np. brandings/{userId}/logo\_{uuid}.png).
4. **Zapis do bazy:** Zwrócony nowy URL zapisuje atomowo w tabeli /branding/{userId}.

## **4\. 🚨 Edge Cases i Restrykcje Planów (Feature Gating)**

W tym miejscu architektura musi spotkać się z biznesem, zgodnie z tabelą planów (Plan Basic nie posiada własnego
brandingu).

- **Ograniczenia UI w Planie Basic:** Jeżeli auth().sessionClaims.stripePlan \=== 'basic', cała sekcja "Identyfikacja
  wizualna" (Logo i Kolor) jest zablokowana (Read-Only lub maskowana przez nakładkę). Na nakładce znajduje się
  informacja: _"Twój obecny plan nie pozwala na zmianę brandingu. Przejdź na plan Standard, aby wgrać własne logo i
  kolory."_ oraz przycisk "Zwiększ limit".
- **Downgrade (Premium \-\> Basic):** Jeśli użytkownik wgrał logo w planie Standard, a potem zrezygnował z subskrypcji i
  spadł do planu Basic, jego logo **nie jest usuwane z bazy**, ale portal klienta (/status) go nie renderuje. Portal
  klienta posiada warunek logiczny w Server Components:  
  const displayBranding \= plan \=== 'basic' ? defaultCraftFlowBranding : contractorBranding;
- **XSS Protection:** Domyślna wiadomość e-mail (która może być renderowana z HTML) jest ściśle sanitizowana po stronie
  serwera przed wysłaniem na adresy e-mail klientów, aby uniknąć ataków typu Cross-Site Scripting.

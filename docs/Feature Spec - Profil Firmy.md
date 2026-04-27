# **🧩 Feature Spec: Profil Firmy i Zarządzanie Adresem**

**Moduł:** Dashboard Wykonawcy \-\> Profil Firmy

**Domena (DDD):** src/features/contractor \+ src/features/shared (Address)

**Zgodność:** PRD Master v5.0 (Supabase, PostgreSQL, Drizzle ORM)

## **1\. 🏗️ Architektura DDD: Shared Kernel (Współdzielone Jądro)**

W modelu relacyjnym v5.0, "Profil Firmy" to agregat łączący dane tożsamościowe z fizyczną lokalizacją biura/siedziby.
Ponieważ encja Adresu jest wykorzystywana w trzech różnych miejscach aplikacji (Profil Firmy, Klienci CRM, Projekty), z
punktu widzenia Domain-Driven Design (DDD) umieszczamy ją w domenie **shared** (Shared Kernel).

Dzięki temu domeny nie są od siebie sztucznie zależne (np. domena projektów nie musi importować bazy danych z domeny
profilu).

### **Struktura folderów (Feature-Sliced Design):**

src/  
└── features/  
 ├── contractor/ \# Domena profilu wykonawcy  
 ├── crm/ \# Domena klientów  
 ├── projects/ \# Domena projektów  
 └── shared/ \# ⬅️ WSPÓŁDZIELONE JĄDRO  
 ├── schema.ts \# Definicja tabeli addresses  
 ├── components/  
 │ └── address-form-fields.tsx \# Gotowe pola formularza do reużycia  
 └── types.ts

## **2\. 🗄️ Struktura Bazy Danych (Drizzle ORM)**

**Kluczowe założenie biznesowe:** Wdrożenie adresów w fazie MVP jest **opcjonalne**. Wykonawca nie musi podawać adresu
swojej siedziby, a projekty i klienci mogą istnieć bez przypisanych adresów.

Pole address_id w tabelach relacyjnych posiada ograniczenie UNIQUE, ale **musi dopuszczać wartości NULL** (nullable).

### **2.1. Encja Adresu (src/features/shared/schema.ts)**

import { pgTable, varchar, text, timestamp, uuid } from 'drizzle-orm/pg-core';  
import { clients } from '@/features/crm/schema';

export const addresses \= pgTable('addresses', {  
 id: uuid('id').primaryKey().defaultRandom(),  
 street: varchar('street', { length: 255 }).notNull(),  
 postalCode: varchar('postal_code', { length: 20 }).notNull(),  
 city: varchar('city', { length: 255 }).notNull(),  
 country: varchar('country', { length: 255 }).default('Polska'),  
 additionalInfo: text('additional_info'),

// Relacja 1:M z Klientem (opcjonalna)  
 clientId: uuid('client_id').references(() \=\> clients.id, { onDelete: 'cascade' }),

createdAt: timestamp('created_at').defaultNow().notNull(),  
 updatedAt: timestamp('updated_at').defaultNow().notNull(),  
});

### **2.2. Encja Wykonawcy (src/features/contractor/schema.ts)**

import { pgTable, varchar, text, timestamp, uuid } from 'drizzle-orm/pg-core';  
import { addresses } from '@/features/shared/schema';

export const contractorProfile \= pgTable('contractor_profile', {  
 id: varchar('id', { length: 255 }).primaryKey(), // Clerk ID  
 companyName: varchar('company_name', { length: 255 }).notNull(),  
 industry: varchar('industry', { length: 100 }),  
 phone: varchar('phone', { length: 50 }),  
 brandColor: varchar('brand_color', { length: 7 }).default('\#10B981'),  
 logoUrl: text('logo_url'),

// Relacja 1:1 z Adresem (Opcjonalna \- nullable)  
 addressId: uuid('address_id').references(() \=\> addresses.id, { onDelete: 'set null' }).unique(),

createdAt: timestamp('created_at').defaultNow().notNull(),  
 updatedAt: timestamp('updated_at').defaultNow().notNull(),  
});

## **3\. 📝 Zakres Danych (Pola Formularza)**

Strona /app/company wyświetla jeden spójny formularz.

### **3.1. Sekcja: Dane Biznesowe (contractor_profile)**

- **Nazwa Firmy:** (Wymagane) Wyświetlana w Portalu Klienta.
- **Branża:** (Wymagane) Wykorzystywana do kategoryzacji.
- **NIP:** (Opcjonalne) Do celów formalnych.
- **Publiczny E-mail:** (Wymagane) Kontaktowy e-mail dla klienta.
- **Telefon:** (Opcjonalne) Publiczny numer telefonu.

### **3.2. Sekcja: Siedziba Firmy (addresses \- Opcjonalna)**

Jeżeli rzemieślnik zdecyduje się wypełnić adres, formularz waliduje pełny zestaw. Jeżeli zostawi puste – ignorujemy
zapis adresu.

- **Ulica i numer:** (Opcjonalne globalnie, wymagane jeśli podano miasto).
- **Kod pocztowy:** (Opcjonalne).
- **Miejscowość:** (Opcjonalne).
- **Kraj:** (Domyślnie: Polska).
- **Dodatkowe info:** Np. "Piętro 2", "Wejście od podwórza".

## **4\. 🔄 Logika Biznesowa i Operacje na Profilu**

### **4.1. Pobieranie danych (Query z LEFT JOIN)**

Podczas ładowania strony /app/company, system musi obsłużyć fakt, że adres może nie istnieć. Stosujemy LEFT JOIN:

const profile \= await db  
 .select()  
 .from(contractorProfile)  
 .leftJoin(addresses, eq(contractorProfile.addressId, addresses.id))  
 .where(eq(contractorProfile.id, userId));

### **4.2. Zapis i Aktualizacja (Server Action z Transakcją)**

Zapis odbywa się wewnątrz **transakcji SQL**:

1. Walidacja schematu (Zod w trybie .null() dla bloku adresu).
2. Sprawdzenie, czy formularz zawiera dane adresowe.
3. **Jeśli brak adresu z frontendu:** Wykonaj tylko UPDATE na tabeli contractor_profile. Jeśli wcześniej był przypisany
   adres, a teraz wykonawca go wyczyścił – usuń powiązany rekord w addresses i ustaw address_id na NULL.
4. **Jeśli są dane adresowe i brak addressId w profilu:** INSERT do addresses ➡️ UPDATE w contractor_profile
   (przypisanie nowego wygenerowanego address_id).
5. **Jeśli są dane adresowe i profil posiadał już addressId:** Wykonaj tylko UPDATE w tabeli addresses dla istniejącego
   ID.

## **5\. 🗃️ Wpływ na inne encje i pobieranie danych (Data Fetching)**

Opcjonalność Adresu wpływa również na pozostałe domeny używające tej tabeli.

### **5.1. Domena CRM (Klienci)**

- **Schemat:** Tabela addresses posiada opcjonalne pole client_id w relacji 1:M z tabelą clients.
- **Data Fetching:** Kiedy wyświetlamy profil klienta w /app/clients/\[id\], dociągamy jego adresy za pomocą prostego
  SELECT WHERE:

const clientAddresses \= await db  
 .select()  
 .from(addresses)  
 .where(eq(addresses.clientId, targetClientId));

### **5.2. Domena Projects (Zlecenia)**

- **Schemat:** Tabela projects posiada opcjonalne pole address_id (UNIQUE, NULLABLE). Projekt może być "Zdalny".
- **Data Fetching:** Widoki szczegółów projektu (/app/projects/\[id\] oraz /status/\[token\]) muszą używać LEFT JOIN,
  aby aplikacja działała poprawnie bez przypisanego adresu:

const projectDetails \= await db  
 .select({  
 project: projects,  
 client: clients,  
 address: addresses, // Będzie NULL, jeśli brak przypisania  
 })  
 .from(projects)  
 .innerJoin(clients, eq(projects.clientId, clients.id))  
 .leftJoin(addresses, eq(projects.addressId, addresses.id)) // Kluczowe\!  
 .where(eq(projects.id, targetProjectId));

## **6\. 🎨 UI / UX (Zasady Prezentacji)**

- **Opcjonalność w UI:** Zrezygnowanie ze znaczników \* (wymagane) przy polach adresowych. Formularz adresu może być
  zwinięty w akordeonie (Accordion) lub panelu "Opcje dodatkowe", by nie przytłaczać rzemieślnika przy pierwszym
  wejściu.
- **Reużywalność:** Formularz adresu to wyizolowany komponent \<AddressFormFields /\>, udostępniany z folderu
  features/shared, używany zarówno tutaj, jak i przy tworzeniu nowych projektów.
- **Widok w Portalu Gościa:** Jeśli zmienna address pobrana dla projektu to null, interfejs Osi Czasu u klienta płynnie
  i bez błędów ukrywa sekcję lokalizacji (warunkowe renderowanie: {address && \<div\>📍 {address.city}\</div\>}).

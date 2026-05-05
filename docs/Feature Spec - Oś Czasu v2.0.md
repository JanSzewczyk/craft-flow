# 🧩 Feature Spec: Szczegóły Projektu i Oś Czasu (Timeline)

**Moduł:** Dashboard Wykonawcy → Widok Projektu

**Powiązane trasy:** `/app/projects/[id]` oraz `/app/projects/[id]/files` (Nested Routes)

**Zależności:** PostgreSQL (Drizzle ORM), Supabase Storage, Resend

**Status implementacji:** 🟡 Częściowo — model danych i tworzenie projektu gotowe; widoki, akcje kroków i obsługa plików
do zaimplementowania

---

## 1. 🖥️ Opis Interfejsu (UI/UX) i Układ Strony

Widok szczegółów projektu opiera się na układzie z **Współdzielonym Layoutem** (wspólny nagłówek i prawa kolumna) oraz
przełączalną główną strefą zawartości.

### Lewa Kolumna: Przestrzeń Robocza (70% szerokości)

- **Nagłówek i Nawigacja:** Tytuł projektu z Inline Edit oraz linki nawigacyjne (zakładki) działające jako osobne
  ścieżki w Next.js:
  1. `/app/projects/[id]` → Widok "Oś Czasu"
  2. `/app/projects/[id]/files` → Widok "Wszystkie Pliki"
- **Widok A: Oś Czasu (page.tsx)**
  - Pionowa lista kroków (timeline).
  - Przycisk do oznaczania kroków jako zakończone, edycja nazw kroków.
  - **Strefa Uploadu:** Drag & Drop do wgrywania plików. Wgrywane pliki otrzymują relację do konkretnego kroku (stepId).
  - Sekcja z miniaturami przypisanymi do danego etapu.
- **Widok B: Wszystkie Pliki (files/page.tsx)**
  - **Filtry i Szukajka:** Pasek wyszukiwania (po nazwie pliku) oraz filtry: "Wszystkie", "Zdjęcia", "Dokumenty".
  - **Widok Tabeli (Data Table):** Załączniki wyświetlane w tabeli z paginacją.
    - **Kolumny Tabeli:**
      1. Podgląd: Miniatura (zdjęcia) lub ikona dokumentu (PDF/Word).
      2. Nazwa pliku: Z obciętym długim tekstem (truncate).
      3. Dodano w etapie: Badge z nazwą kroku.
      4. Dodano przez: Awatar + imię (Wykonawca lub Klient).
      5. Data dodania: Format `12.03.2026, 14:30`.
      6. Akcje: Dropdown menu.
  - **Mechanika Podglądu (Preview):** Kliknięcie otwiera modal (Lightbox dla obrazów) lub czytnik PDF.
  - **Ograniczenia Akcji:** Opcja "Pobierz" dostępna dla każdego. "Usuń plik" — tylko gdy
    `currentUser.id === attachment.uploadedBy`.

### Prawa Kolumna: Karta Klienta i Akcje (30% szerokości)

Zamocowana na górze (Sticky). Renderowana w `layout.tsx` — nie przeładowuje się przy zmianie zakładek.

- Status Projektu, Dane Klienta, Potwierdzenie odczytu.
- Główne Akcje: Opublikuj, Skopiuj Link, Wyślij E-mail, Zakończ Projekt.

---

## 2. 🗂️ Model Danych

Projekt używa **PostgreSQL z Drizzle ORM** (Supabase). Dane kroków są w osobnej tabeli (relacja 1:N), a załączniki w
kolejnej tabeli z FK do projektu i kroku.

### Tabela `projects` ✅ Zaimplementowana

```ts
// features/projects/server/db/schema.ts
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  contractorId: varchar("contractor_id", { length: 255 })
    .notNull()
    .references(() => contractorProfile.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "restrict" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: projectStatusEnum("status").default("DRAFT").notNull(),
  publicToken: varchar("public_token", { length: 50 }).notNull().unique(),
  lastClientViewAt: timestamp("last_client_view_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
```

Status enum: `DRAFT | ACTIVE | COMPLETED | ARCHIVED | DELETED`

### Tabela `project_steps` ✅ Zaimplementowana

```ts
export const projectSteps = pgTable("project_steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
```

### Tabela `project_attachments` ❌ Do zaimplementowania

```ts
// features/projects/server/db/schema.ts — DO DODANIA
export const projectAttachments = pgTable("project_attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  stepId: uuid("step_id")
    .notNull()
    .references(() => projectSteps.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  type: attachmentTypeEnum("type").notNull(), // 'image' | 'document'
  url: text("url").notNull(),
  storagePath: text("storage_path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  uploadedBy: varchar("uploaded_by", { length: 255 }).notNull(), // Clerk userId
  uploadedByRole: uploadedByRoleEnum("uploaded_by_role").notNull() // 'contractor' | 'client'
});
```

Pliki przechowywane w **Supabase Storage**, bucket: `project-files` (do utworzenia).

Ścieżka w storage: `{contractorId}/{projectId}/{stepId}/{filename}`

---

## 3. 🔄 Ścieżka Użytkownika i Logika Backendowa (Server Actions)

### 3.1. Pobieranie Danych

**Oś Czasu:** Pojedyncze zapytanie z Drizzle Relationship API — `getProjectById()` zwraca projekt z relacjami
`{ client, steps }`. Następnie pobieramy attachments per stepId.

```ts
// Istniejąca query (queries.ts) — zwraca projekt + steps + client
const [err, project] = await getCachedProjectById(projectId, contractorId);

// Do dodania — attachments dla wszystkich steps projektu
const [attErr, attachments] = await getAttachmentsByProject(projectId);
// Frontend mapuje: attachments.filter(a => a.stepId === step.id)
```

**Zakładka Pliki:** Osobna query z paginacją, sortowanie po `uploadedAt DESC`, limit 20.

### 3.2. Wgrywanie Plików ❌ Do zaimplementowania

Gdy użytkownik wgrywa plik w konkretnym etapie:

1. Server Action `uploadAttachmentAction(formData, stepId)`:
   - Walidacja: typy (`image/jpeg`, `image/png`, `image/webp`, `application/pdf`), max 5MB
   - Upload do Supabase Storage (`uploadFile("project-files", path, buffer, ...)`)
   - INSERT do `project_attachments` z `uploadedBy: userId` i `uploadedByRole: 'contractor'`
2. `revalidatePath("/app/projects/[id]")`

```ts
// lib/supabase/storage.ts — istniejące funkcje do reużycia:
uploadFile(bucket, path, buffer, { contentType });
getPublicUrl(bucket, path);
deleteFile(bucket, paths);
```

### 3.3. Zarządzanie Krokami i Plikami

- **Zamknięcie kroku ❌:** `updateStepCompletionAction(stepId, isCompleted)` → `updateProjectStepCompletion()` (mutacja
  istnieje w DB layer)
- **Zmiana kolejności (D&D) ❌:** `reorderStepsAction(steps)` → `reorderProjectSteps()` (mutacja istnieje w DB layer)
- **Usunięcie kroku ❌:** CASCADE w DB automatycznie usuwa `project_attachments`. Action musi jeszcze usunąć pliki z
  Supabase Storage (`deleteFile()`).
- **Usunięcie pliku ❌:** Server Action weryfikuje `auth().userId === attachment.uploadedBy`, usuwa ze Storage i z
  tabeli.

---

## 4. 🚨 Edge Cases

- **Pusty stan plików:** Zakładka "Wszystkie Pliki" pokazuje Empty State z komunikatem o braku dokumentów.
- **Plik zbyt duży:** Walidacja front-endowa blokuje pliki > 5MB i niedozwolone formaty — Toast z komunikatem.
- **Zablokowanie Projektu:** Po `status = COMPLETED` — Server Actions blokują mutacje na krokach i plikach (warunek w
  service/permissions).

---

## 5. 👨‍💻 Developer Guide: Śledzenie Aktywności Klienta (`lastClientViewAt`)

Mechanizm throttlingu chroni przed nadmiernymi zapisami przy odświeżaniu.

### Backend — Server Action ❌ Do zaimplementowania

```ts
// features/projects/server/actions/update-client-view.action.ts
"use server";

import { db } from "~/lib/supabase/db";
import { projects } from "~/lib/supabase/schema";
import { eq } from "drizzle-orm";

export async function updateClientViewAction(projectId: string) {
  const [err, project] = await getProjectById(projectId);
  if (err || !project) return { success: false };

  const lastViewAt = project.lastClientViewAt;
  const now = new Date();

  // Optymalizacja: aktualizuj tylko jeśli minęło 5 minut
  if (lastViewAt && now.getTime() - lastViewAt.getTime() < 5 * 60 * 1000) {
    return { success: true };
  }

  await db.update(projects).set({ lastClientViewAt: now }).where(eq(projects.id, projectId));

  return { success: true };
}
```

### Frontend — Niewidzialny komponent kliencki ❌ Do zaimplementowania

```tsx
// app/(app)/status/[token]/ClientTracker.tsx
"use client";

import { useEffect } from "react";
import { updateClientViewAction } from "~/features/projects/server/actions/update-client-view.action";

export function ClientTracker({ projectId }: { projectId: string }) {
  useEffect(() => {
    updateClientViewAction(projectId);
  }, [projectId]);

  return null;
}
```

### Integracja — Widok Gościa ❌ Do zaimplementowania

```tsx
// app/(app)/status/[token]/page.tsx
import { ClientTracker } from "./ClientTracker";

export default async function GuestViewPage({ params }: { params: { token: string } }) {
  // pobieranie projektu po publicToken
  return (
    <div>
      <ClientTracker projectId={project.id} />
      {/* Reszta UI */}
    </div>
  );
}
```

---

## 6. 📋 Checklist Implementacji

### Baza Danych

- [ ] Dodać enums `attachmentTypeEnum`, `uploadedByRoleEnum` w schema.ts
- [ ] Dodać tabelę `project_attachments` w `features/projects/server/db/schema.ts`
- [ ] Zarejestrować `projectAttachments` w `lib/supabase/schema.ts`
- [ ] Uruchomić `npm run db:generate && npm run db:migrate`
- [ ] Dodać queries: `getAttachmentsByProject()`, `getAttachmentsByStep()`, `getAttachmentById()`
- [ ] Dodać mutations: `createAttachment()`, `deleteAttachment()`

### Supabase Storage

- [ ] Utworzyć bucket `project-files` w Supabase Dashboard
- [ ] Skonfigurować polityki RLS dla bucketu

### Server Actions

- [ ] `upload-attachment.action.ts` — upload pliku do etapu
- [ ] `delete-attachment.action.ts` — usunięcie pliku (weryfikacja ownership)
- [ ] `update-step-completion.action.ts` — checkbox na etapie
- [ ] `reorder-steps.action.ts` — drag & drop kolejności
- [ ] `delete-project-step.action.ts` — usunięcie etapu + cascade storage
- [ ] `update-client-view.action.ts` — throttled lastClientViewAt

### Trasy Next.js

- [ ] `app/(app)/projects/[id]/layout.tsx` — shared layout z prawą kolumną
- [ ] `app/(app)/projects/[id]/page.tsx` — Oś Czasu
- [ ] `app/(app)/projects/[id]/files/page.tsx` — Wszystkie Pliki
- [ ] `app/(app)/status/[token]/page.tsx` — widok gościa/klienta
- [ ] `app/(app)/status/[token]/ClientTracker.tsx` — komponent śledzenia

### Komponenty

- [ ] `ProjectTimeline` — lista kroków z checkboxem i drag & drop
- [ ] `StepUploadZone` — Drag & Drop strefa uploadu przypisana do kroku
- [ ] `AttachmentsTable` — tabela z TanStack Table + paginacja + filtry
- [ ] `AttachmentPreview` — modal/Lightbox dla podglądu pliku
- [ ] `ProjectSidebar` — prawa kolumna (status, dane klienta, akcje)

### Testy i Storybook

- [ ] Builders: `attachmentBuilder` w `features/projects/test/builders/`
- [ ] Stories dla nowych komponentów
- [ ] Schema unit tests dla nowych Zod schemas
- [ ] Action tests dla nowych akcji

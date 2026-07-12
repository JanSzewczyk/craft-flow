---
paths:
  - "features/**/*.ts"
  - "features/**/*.tsx"
---

## Directory structure

```
features/{domain}/
├── components/
│   ├── forms/
│   ├── {component}.tsx
│   ├── {component}.stories.tsx
│   └── index.tsx                   # barrel — components only
├── constants/
├── schemas/
│   ├── {domain}-schema.ts          # Zod + exported *FormData types
│   └── {domain}-schema.test.ts
├── server/
│   ├── actions/
│   │   ├── {verb}-{domain}.action.ts
│   │   ├── logger.ts               # createLogger({ module: "domain-actions" })
│   │   ├── map-service-error.ts    # error code → Polish user message
│   │   └── {domain}-actions.test.ts
│   ├── db/
│   │   ├── schema.ts               # data model definitions + inferred row types — not re-exported from index.ts
│   │   ├── queries.ts              # read operations — one per function, result-tuple return type
│   │   ├── mutations.ts            # write operations — one per function, result-tuple return type
│   │   └── index.ts               # re-exports queries + mutations only
│   ├── api/                        # optional — wrappers around external/third-party APIs
│   │   ├── {verb}-{resource}.ts    # one external-API concern per file
│   │   └── index.ts               # optional barrel
│   ├── services/
│   │   └── {domain}.service.ts     # orchestration only, no raw persistence calls
│   └── permissions.ts              # canDoX guard functions
├── types/
│   ├── {entity}.ts                 # shared types (see section below)
│   ├── {filter}.ts
│   └── index.ts                    # barrel — re-exports all types/
├── utils/                          # optional — pure, framework-free logic (reducers, formatters,
│   ├── {name}.ts                   # URL/query builders); every file here should be unit-tested
│   └── {name}.test.ts
├── context/                        # optional — only files that call `React.createContext`
│   └── {name}.context.tsx          # Context + Provider + consumer hook, co-located in one file
├── hooks/                          # optional — client hooks that don't define a Context
│   └── use-{name}.ts               # standalone hook, or one that builds on a context/ consumer hook
└── test/
    └── builders/
        ├── {entity}.builder.ts     # mimicry-js + faker
        └── index.ts
```

`utils/`, `context/`, and `hooks/` are only added when a feature actually needs client-side state/logic
beyond the server-driven zones above — add them on demand, don't scaffold empty ones. Keep the
distinction:

- `utils/` is pure and framework-free — no React imports, straightforward to unit-test.
- `context/` holds files named `{name}.context.tsx`. Each file is exclusively the code around one
  `React.createContext` call: the context object, its `Provider` component, and the consumer hook
  that reads it (e.g. `useTemplateEditor`) — all co-located in that one file.
- `hooks/` holds general-purpose React hooks that do **not** define their own `React.createContext`.
  This covers two cases: standalone client-side logic (state, effects, polling, subscriptions) with
  no relation to any `context/` file, and hooks that build additional functionality on top of a
  `context/` consumer hook (e.g. a hook that calls `useTemplateEditor()` and derives extra state from
  it). If a hook's own job is to create and expose a Context, it belongs in `context/`, not here.

**No top-level `index.ts`** for the feature. Import from sub-paths directly:

- `import { TemplateCard } from "~/features/templates/components"` ✓
- `import { TemplateCard } from "~/features/templates"` ✗

---

## Server / client boundary

This is the most important architectural rule. Code is split into three zones:

| Zone         | Directory                               | Notes                                                                            |
| ------------ | --------------------------------------- | -------------------------------------------------------------------------------- |
| Server-only  | `server/`                               | May contain `import "server-only"`. Must not be imported by client components.   |
| Shared types | `types/`                                | No dependencies on `server/`. Safe to import from anywhere.                      |
| Universal    | `components/`, `schemas/`, `constants/` | Used by both server and client code. Contains both server and client components. |

**Rule: client components (`"use client"`) must NEVER import from `server/`.**

Server modules often contain `import "server-only"` (services, permissions). Importing from them in a client component causes a build error. Even without `server-only`, importing Drizzle ORM types or server-side logic from client code is incorrect.

`schemas/` and `constants/` are used on both sides: Zod schemas validate data in server actions and in client-side form libraries; constants are consumed by server services, client components, and pages alike. They are not client-only.

### What to import from where

```ts
// ✓ client component — imports from types/ and components/
import {
  ProjectStatus,
  type ClientProjectListItem,
} from "~/features/projects/types/project";
import { ProjectStatusBadge } from "~/features/projects/components";

// ✓ server component / page — can import from server/ directly
import { getClientProjects } from "~/features/projects/server/services/projects.service";
import { ProjectStatus } from "~/features/projects/types/project";

// ✗ client component — never import from server/
import { ProjectStatus } from "~/features/projects/server/db/schema"; // WRONG
import { getClientProjects } from "~/features/projects/server/services/projects.service"; // WRONG
```

---

## `types/` — shared types between server and client

The `types/` directory is the **only** path from which client components may import domain types. All code (server and client) can freely import from here.

### What belongs in `types/`

| Type category              | Example                                        | Why here                                              |
| -------------------------- | ---------------------------------------------- | ----------------------------------------------------- |
| Domain enum const + type   | `ProjectStatus`                                | Used in component props and server queries alike      |
| Service result / DTO types | `ClientProjectListItem`, `ClientProjectDetail` | Returned by services, received as component props     |
| Public view types          | `PublicProjectView`                            | Used in both server pages and client components       |
| Filter / option types      | `ProjectStatusFilter`, `ContractorListOptions` | Used in query params passed from server to components |
| Cross-domain list items    | `ClientContractorListItem`                     | Passed from server to client card/table components    |

### What stays in `server/db/schema.ts`

Types tightly coupled to Drizzle ORM must stay in `server/`:

| Type                                          | Why it stays                                  |
| --------------------------------------------- | --------------------------------------------- |
| `Project` (`BuildQueryResult` with relations) | Drizzle-specific — references ORM internals   |
| `ProjectRow` (`$inferSelect`)                 | Raw DB row — internal to queries and services |
| `ProjectStep` (`$inferSelect`)                | Raw DB row — internal to queries              |
| `pgEnum` definitions                          | Required by Drizzle table definitions         |

These types are used only inside `server/db/queries.ts` and `server/services/*.service.ts`. They never appear in component props.

### Pattern for domain enum const + type

Define the enum as a `const` object in `types/`, derive the type from it:

```ts
// features/projects/types/project.ts
export const ProjectStatus = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  ARCHIVED: "ARCHIVED",
  DELETED: "DELETED",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const ProjectStatuses = Object.values(
  ProjectStatus,
) as Array<ProjectStatus>;
```

Do **not** annotate the const with `Record<ProjectStatus, ProjectStatus>` — this widens all values to the union and breaks computed-key records and `Extract<>` narrowing. The `as const` alone preserves literal types; `satisfies` can be added when an external constraint must be enforced without widening.

The corresponding `pgEnum` in `server/db/schema.ts` uses string literals directly and does not import from `types/`:

```ts
// features/projects/server/db/schema.ts
export const projectStatusEnum = pgEnum("project_status", [
  "DRAFT",
  "ACTIVE",
  "COMPLETED",
  "ARCHIVED",
  "DELETED",
]);
```

### `types/index.ts` barrel

Every `types/` directory must have an `index.ts` that re-exports all sub-files:

```ts
// features/projects/types/index.ts
export * from "./project";
export * from "./contractor";
export * from "./project-filter";
```

### Service re-exports

Services re-export the types they use so that callers have a single stable import point:

```ts
// features/projects/server/services/projects.service.ts
export type {
  ClientProjectListItem,
  ClientProjectDetail,
  ClientProjectStep,
  PublicProjectView,
} from "~/features/projects/types/project";

export type {
  ClientContractorListItem,
  ContractorListOptions,
  ContractorListResult,
} from "~/features/projects/types/contractor";
```

This is optional but useful when the service is the only entry-point callers know. The underlying types still live in `types/`.

---

## Layer dependency rules (one direction only)

```
Action → Service → Permission → DB / API
             ↓              ↓
           Schema (Zod)   Data model schema

types/ ← imported by all layers, no restriction
```

Each layer imports only downward — never from the layer above.
`types/` is the exception: it has no dependencies of its own (no imports from `server/`) and may be imported by any layer.

---

## Return types per layer

| Layer                  | Type                                                                     |
| ---------------------- | ------------------------------------------------------------------------ |
| DB queries / mutations | `SupabaseServiceResult<T>` → `[SupabaseServiceError, null] \| [null, T]` |
| Permissions            | `SupabaseServiceResult<void>`                                            |
| Service reads          | `SupabaseServiceResult<T>` — wrap with `React.cache()`                   |
| Service mutations      | `ServiceResult<BaseServiceError, T>`                                     |
| Actions                | `ActionResponse<T>` from `~/lib/action-types`                            |

Import sources:

- `~/lib/supabase/errors` — `SupabaseServiceResult`, `SupabaseServiceError`, `categorizeSupabaseError`
- `~/lib/services/errors` — `ServiceResult`, `BaseServiceError`
- `~/lib/action-types` — `ActionResponse`, `RedirectAction`, `isActionSuccess`, `isActionFailed`

---

## Service mutation guard chain (always in this order)

```ts
const [roleErr] = await requireRole(userId, [Role.CONTRACTOR]);
if (roleErr) return [roleErr, null];

const [profileErr, profile] = await getCachedContractorProfile(userId);
if (profileErr) return [profileErr, null];

// feature-specific permission guard (canDoX from permissions.ts)
const [permErr] = await canAddTemplate(profile.id);
if (permErr) return [permErr, null];

// DB mutation
const [dbErr, result] = await ...;
if (dbErr) return [dbErr, null];

return [null, result];
```

---

## Action pattern

```ts
"use server";
export async function createTemplateAction(
  data: TemplateFormData,
): ActionResponse<Template> {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated)
    return { success: false, error: "Nie jesteś zalogowany" };

  const [error, template] = await createTemplate(userId, data);
  if (error) return mapTemplateServiceError(error);

  revalidatePath("/app/templates");
  return { success: true, data: template, message: "Szablon został utworzony" };
}
```

- No business logic in actions — delegate entirely to the service.
- `revalidatePath` only on success.
- `map-service-error.ts` translates `BaseServiceError.code` to Polish user strings. Never expose internal codes.

---

## Components

The `components/` directory holds **both server and client components**. There is no hard rule that all components here are one or the other — each file is what it needs to be. Names are domain-driven and descriptive, not constrained to a fixed pattern. Subdirectories (e.g. `forms/`, `portal/`) are used when grouping makes sense.

### Server vs client

Default to **Server Components** — no directive, can be `async`. Add `"use client"` only when the component requires:

- React hooks (`useState`, `useEffect`, `useTransition`, etc.)
- Browser APIs (`window`, `navigator`, `document`)
- Event handlers that can't be passed down as server action props

```ts
// server component — no directive, can be async, can import from server/
export function ProjectProgressBar({ totalSteps, completedSteps }: Props) { ... }

// client component — requires interactivity
"use client";
export function ProjectSidebar({ project, onUpdateStatusAction }: Props) { ... }

// client component — requires useEffect for browser API
"use client";
export function ClientTracker({ token, onTrackAction }: Props) {
  React.useEffect(() => { void onTrackAction(token); }, [token, onTrackAction]);
  return null;
}
```

### Import rules inside components

| Component type                    | Can import from `server/`? | Can import from `types/`? |
| --------------------------------- | -------------------------- | ------------------------- |
| Server component                  | ✓ Yes                      | ✓ Yes                     |
| Client component (`"use client"`) | ✗ Never                    | ✓ Yes                     |

Server actions are passed as props to client components from the page or layout — client components do not import actions directly.

```ts
// ✓ page (server) — wires action as prop
<ProjectSidebar onUpdateStatusAction={updateProjectStatusAction} />

// ✓ client component — receives action as prop, types from types/ only
type Props = { onUpdateStatusAction(id: string, status: ProjectStatus): ActionResponse<void> };
```

### Other rules

- Never add `useMemo` / `useCallback` / `memo` — React Compiler handles memoization automatically.
- Button icons: use `startIcon` / `endIcon` props, not children.
- Forms: React Hook Form + Zod resolver for complex forms; `useActionState` for simple ones.
- Co-locate `{component}.stories.tsx` next to every component file.
- The `components/index.tsx` barrel exports named component exports only — no types, no re-exports from `server/`.

---

## `db/` — persistence layer

The `db/` directory is the only place a feature talks to its data store. It is intentionally
**technology-agnostic at the architecture level** — the rules below describe the role each file
plays, not any particular ORM, database, or driver. This project's concrete implementation
(schema syntax, client imports, transaction helper, error categorization) lives in
`.claude/rules/db-patterns.md` — treat that file as the canonical reference for the current stack,
and this section as the structure/role definition that would hold even if the underlying database
technology changed.

| File | Role |
| ---- | ---- |
| `schema.ts` | Data model definitions (tables/collections) + the row/entity types inferred from them |
| `queries.ts` | Read operations, one per function |
| `mutations.ts` | Write operations (create/update/delete), one per function |
| `index.ts` | Re-exports `queries` + `mutations` only — never re-exports `schema.ts` |

`schema.ts` is never re-exported from `index.ts`. Anything that needs a type defined in `schema.ts`
imports it directly from `./schema` (or the feature's `types/`, if it's a DTO/view type meant for
callers outside `server/`) — `db/index.ts` is the entry point for operations, not for the data
model itself.

### Flat vs. nested layout

- **One domain schema** → flat: `schema.ts`, `queries.ts`, `mutations.ts`, `index.ts` sit directly
  in `db/`.

  ```
  server/db/
  ├── schema.ts
  ├── queries.ts
  ├── mutations.ts
  └── index.ts
  ```

- **Two or more domain schemas** → nested: each schema gets its own subfolder under `db/`, named
  after that schema, each with its own `schema.ts` / `queries.ts` / `mutations.ts` / `index.ts` —
  and the same rule applies at every level: each subfolder's `index.ts` re-exports its `queries`
  and `mutations` only, never its `schema.ts`. Do not mix a flat top-level schema with subfolders —
  once a second schema is introduced, every schema in that feature moves into its own subfolder.

  ```
  server/db/
  ├── index.ts                        # re-exports all subfolders (queries + mutations only)
  ├── {schema-a}/
  │   ├── schema.ts
  │   ├── queries.ts
  │   ├── mutations.ts
  │   └── index.ts
  └── {schema-b}/
      ├── schema.ts
      ├── queries.ts
      ├── mutations.ts
      └── index.ts
  ```

Rules that apply regardless of the underlying persistence technology:

- **One SQL/query operation per function, no orchestration.** DB functions never call other DB
  functions. If two operations must be atomic, that composition belongs in the service layer.
- **Single object argument.** Every DB function takes one object argument, including an optional
  client/connection parameter so the same function can run standalone or inside a transaction.
- **Transactions belong to the service layer, not the DB layer.** A DB function throws on failure
  when called inside a transaction; the service layer owns `try/catch` and rollback.
- **Never throw across the layer boundary in the non-transactional case** — every DB function
  returns the project's result-tuple type (see Return types per layer) and categorizes errors at
  the point they originate.
- **DTO/view types** (the shape returned to callers) live in `types/`, not in `queries.ts`. Query
  functions import them from `types/` for their return type annotations.
- **Cross-entity operations**: DB functions that touch an entity owned by another feature live in
  `features/shared/server/db/{entity}/mutations.ts` (or `queries.ts`), never duplicated into the
  calling feature.
- Register new tables/collections in the project's central schema registry.
- Logger: `createLogger({ module: "domain-db" })`.

---

## `api/` — external API integrations (optional)

Added only when a feature needs to call a third-party/external API directly (an auth provider,
a billing API, a payment gateway, etc.), as opposed to the feature's own persistence layer. Not
scaffolded by default — add it on demand, same as `utils/`, `context/`, and `hooks/`.

```
server/api/
├── {verb}-{resource}.ts     # one external-API concern per file, e.g. detect-clerk-plan.ts
└── index.ts                 # optional barrel
```

- Same shape as `db/`: one function per file, single object argument where useful, result-tuple
  return type, errors categorized at the point they originate — never thrown across the layer
  boundary.
- `api/` functions never call each other; composition happens in `services/`.
- Wrap read-heavy calls with `cache()` the same way `db/` queries are cached, when the underlying
  API call is safe to dedupe within a request.

---

## Permissions file

```ts
import "server-only";

export async function canAddTemplate(
  contractorId: string,
): Promise<SupabaseServiceResult<void>> {
  if (overLimit) return [SupabaseServiceError.limitExceeded(max), null];
  return [null, undefined];
}
```

---

## Test builders

```ts
export const templateBuilder = build<Template>({
  fields: {
    id: () => faker.string.uuid(),
    contractorId: () => faker.string.uuid(),
    name: () => faker.lorem.words(3),
    ...
  },
  traits: { noDescription: { overrides: { description: null } } }
});
```

One builder per entity. Export all from `test/builders/index.ts`.

Builders for types from `types/` import from `types/`, not from `server/`:

```ts
// ✓
import {
  ProjectStatus,
  type PublicProjectView,
} from "~/features/projects/types/project";

// ✗ — builder runs in test environment, must not import from server/
import { ProjectStatus } from "~/features/projects/server/db/schema";
```

---

## Logging

```ts
const logger = createLogger({ module: "templates-service" });
logger.info({ userId, templateId }, "Template created successfully");
logger.error(
  { userId, operation: "createTemplate", errorCode: err.code },
  "DB insert failed",
);
```

Always include `userId`, `operation`, and `errorCode` on failures. Log at the layer where the error originates — do not re-log the same error higher up.

---

## New feature checklist

- [ ] `types/{entity}.ts` — domain const+type enums, DTO types, filter types
- [ ] `types/index.ts` — barrel re-exporting all type files
- [ ] `schemas/{domain}-schema.ts` — Zod + `*FormData` types
- [ ] `server/db/schema.ts` — data model definitions + inferred types, registered in the central schema registry
- [ ] `server/db/queries.ts` + `mutations.ts` + `index.ts`
- [ ] `server/api/` — only if the feature calls an external API directly (optional)
- [ ] `server/permissions.ts` — `canDoX` guards
- [ ] `server/services/{domain}.service.ts` — guard chain, `cache()` on reads, re-export shared types
- [ ] `server/actions/{verb}-{domain}.action.ts` — thin, auth check, revalidate
- [ ] `server/actions/map-service-error.ts` + `logger.ts`
- [ ] `components/` — co-located stories, no imports from `server/` in client components
- [ ] `test/builders/` — builders import from `types/`, not from `server/`
- [ ] Schema unit tests + action unit tests

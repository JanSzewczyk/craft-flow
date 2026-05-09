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
│   │   ├── map-service-error.ts    # error code → Map user message
│   │   └── {domain}-actions.test.ts
│   ├── db/
│   │   ├── schema.ts               # Drizzle tables + inferred types
│   │   ├── queries.ts              # SELECT — SupabaseServiceResult<T>
│   │   ├── mutations.ts            # INSERT/UPDATE/DELETE — transactions where needed
│   │   └── index.ts
│   ├── services/
│   │   └── {domain}.service.ts     # orchestration only, no raw SQL
│   └── permissions.ts              # canDoX guard functions
└── test/
    └── builders/
        ├── {entity}.builder.ts     # mimicry-js + faker
        └── index.ts
```

**No top-level `index.ts`** for the feature. Import from sub-paths directly:
- `import { TemplateCard } from "~/features/templates/components"` ✓
- `import { TemplateCard } from "~/features/templates"` ✗

## Layer dependency rules (one direction only)

```
Action → Service → Permission → DB
             ↓
           Schema (Zod)    DB schema (Drizzle)
```

Each layer imports only downward — never from the layer above.

## Return types per layer

| Layer | Type |
|-------|------|
| DB queries / mutations | `SupabaseServiceResult<T>` → `[SupabaseServiceError, null] \| [null, T]` |
| Permissions | `SupabaseServiceResult<void>` |
| Service reads | `SupabaseServiceResult<T>` — wrap with React `cache()` |
| Service mutations | `ServiceResult<BaseServiceError, T>` |
| Actions | `ActionResponse<T>` from `~/lib/action-types` |

Import sources:
- `~/lib/supabase/errors` — `SupabaseServiceResult`, `SupabaseServiceError`, `categorizeSupabaseError`
- `~/lib/services/errors` — `ServiceResult`, `BaseServiceError`
- `~/lib/action-types` — `ActionResponse`, `RedirectAction`, `isActionSuccess`, `isActionFailed`

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

## Action pattern

```ts
"use server";
export async function createTemplateAction(data: TemplateFormData): ActionResponse<Template> {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) return { success: false, error: "Nie jesteś zalogowany" };

  const [error, template] = await createTemplate(userId, data);
  if (error) return mapTemplateServiceError(error);

  revalidatePath("/app/templates");
  return { success: true, data: template, message: "Szablon został utworzony" };
}
```

- No business logic in actions — delegate entirely to the service.
- `revalidatePath` only on success.
- `map-service-error.ts` translates `BaseServiceError.code` to Polish user strings. Never expose internal codes.

## DB layer rules

- `categorizeSupabaseError(error, "ResourceName")` in every `catch` block — never throw across layer boundaries.
- Register new tables in `lib/supabase/schema.ts`.
- Logger: `createLogger({ module: "domain-db" })`.

### DB function signature

Every DB function takes a **single object argument**. The object always includes `dbClient?: DbClient`
with a default of the module-level `db`, enabling the function to run both standalone and inside
a transaction without any change at the call site.

Import `DbClient` from `~/lib/supabase/db`.

```ts
import { db, type DbClient } from "~/lib/supabase/db";

export async function updateFoo({
  fooId,
  data,
  dbClient = db
}: {
  fooId: string;
  data: FooData;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Foo>> { ... }
```

### Transaction ownership

**Transactions belong to the service layer, not the DB layer.**

DB functions are single-operation SQL wrappers. Any operation that requires atomicity across
multiple DB calls is orchestrated in the service via `withTransaction` from `~/lib/supabase/db`.
Inside the callback, pass `tx` as `dbClient` to each DB function.
Throw on error to trigger rollback — `categorizeSupabaseError` in the service `catch` block
handles both raw Postgres errors and re-thrown `SupabaseServiceError` instances.

```ts
import { withTransaction } from "~/lib/supabase/db";
import { categorizeSupabaseError } from "~/lib/supabase/errors";

try {
  await withTransaction(async (tx) => {
    const [aErr, a] = await insertA({ data, dbClient: tx });
    if (aErr) throw aErr; // rolls back

    const [bErr] = await updateB({ id: a.id, dbClient: tx });
    if (bErr) throw bErr;
  });
} catch (error) {
  const serviceError = categorizeSupabaseError(error, "ResourceName");
  logger.error({ userId, operation: "...", errorCode: serviceError.code }, "Transaction failed");
  return [serviceError, null];
}
```

### Cross-entity DB operations

DB functions that touch an entity owned by another feature live in
`features/shared/server/db/{entity}/mutations.ts` (or `queries.ts`).
Import from the sub-path — never copy SQL into the calling feature's DB layer.

```ts
import { insertAddress, updateAddress, deleteAddress } from "~/features/shared/server/db/addresses";
```

## Permissions file

```ts
import "server-only";

export async function canAddTemplate(contractorId: string): Promise<SupabaseServiceResult<void>> {
  // count check + plan check
  if (overLimit) return [SupabaseServiceError.limitExceeded(max), null];
  return [null, undefined];
}
```

## Components

- Default to Server Components. `"use client"` only when required (interactivity, browser APIs, hooks).
- Never add `useMemo` / `useCallback` / `memo` — React Compiler handles this automatically.
- Button icons: use `startIcon` / `endIcon` props, not children.
- Forms: React Hook Form + Zod resolver for complex forms; `useActionState` for simple ones.
- Co-locate `{component}.stories.tsx` next to every component file.

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

## Logging

```ts
const logger = createLogger({ module: "templates-service" });
logger.info({ userId, templateId }, "Template created successfully");
logger.error({ userId, operation: "createTemplate", errorCode: err.code }, "DB insert failed");
```

Always include `userId`, `operation`, and `errorCode` on failures. Log at the layer where the error originates — do not re-log the same error higher up.

## New feature checklist

- [ ] `schemas/{domain}-schema.ts` — Zod + `*FormData` types
- [ ] `server/db/schema.ts` — Drizzle tables + types, registered in `lib/supabase/schema.ts`
- [ ] `server/db/queries.ts` + `mutations.ts` + `index.ts`
- [ ] `server/permissions.ts` — `canDoX` guards
- [ ] `server/services/{domain}.service.ts` — guard chain, `cache()` on reads
- [ ] `server/actions/{verb}-{domain}.action.ts` — thin, auth check, revalidate
- [ ] `server/actions/map-service-error.ts` + `logger.ts`
- [ ] `components/` — co-located stories
- [ ] `test/builders/` — mimicry-js builders
- [ ] Schema unit tests + action unit tests
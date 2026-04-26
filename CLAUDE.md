# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Craft Flow is an enterprise-ready Next.js 16.2.1 template with React 19.2.0, TypeScript 6.0.2, Tailwind CSS 4.2.2,
React Compiler, and comprehensive testing infrastructure (Vitest 4.1.2, Playwright 1.58.2).

## Commands

### Development

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
```

### Package Management

```bash
npm install          # Install dependencies
npm install <pkg>    # Add dependency
npm install -D <pkg> # Add dev dependency
npm update           # Update dependencies
```

> **Note:** The project uses `legacy-peer-deps=true` (`.npmrc`), required for dependency installation.

### Database Management

```bash
npm run db:generate  # Generate Drizzle migrations from schema changes
npm run db:migrate   # Apply pending migrations to the database
npm run db:push      # Push schema directly to database (dev only)
npm run db:studio    # Open Drizzle Studio GUI for database browsing
```

### Code Quality

```bash
npm run lint         # ESLint check
npm run lint:fix     # ESLint with auto-fix
npm run prettier:check   # Prettier check
npm run prettier:write   # Prettier with auto-fix
npm run type-check   # TypeScript type checking
```

### Testing

```bash
npm run test                  # Run all Vitest tests
npm run test:ci               # Run tests for CI environment
npm run test:coverage         # Generate test coverage report
npm run test:unit             # Unit tests only (with coverage)
npm run test:watch            # Watch mode
npm run test:storybook        # Storybook component tests (with coverage)

# Run a single test file
npx vitest run path/to/file.test.ts
npx vitest run --project=unit path/to/file.test.ts
npx vitest run --project=storybook path/to/file.stories.tsx

# E2E tests (Playwright) - requires build first
npm run build && npm run test:e2e
npm run test:e2e:ci          # E2E tests for CI environment
npm run test:e2e:ui          # Playwright UI mode
```

### Storybook

```bash
npm run storybook:dev         # Start Storybook (port 6006)
npm run storybook:build       # Build static Storybook
npm run storybook:serve       # Serve built Storybook
npm run test:storybook        # Run Storybook component tests
```

### Analysis

```bash
npm run analyze               # Bundle analyzer
```

## Architecture

### Tech Stack

- **Next.js**: 16.2.1 (App Router, Turbopack, React Compiler)
- **React**: 19.2.0 with React Compiler enabled
- **TypeScript**: 6.0.2 (strict mode with `noUncheckedIndexedAccess`)
- **Tailwind CSS**: 4.2.2 (CSS-first config)
- **@szum-tech/design-system**: 3.18.3
- **Vitest**: 4.1.2 (unit & integration tests)
- **Playwright**: 1.58.x (E2E tests)
- **Storybook**: 10.4.0-alpha.6 (component development)
- **Zod**: 4.3.6 (validation)
- **Pino**: 10.3.1 (logging)
- **next-themes**: 0.4.6 (theming)
- **@clerk/nextjs**: 7.0.7 (authentication)
- **react-hook-form**: 7.72.0 (form handling)
- **Resend**: 6.9.4 (email service)
- **drizzle-orm**: 0.45.2 (ORM for PostgreSQL)
- **postgres**: 3.4.8 (PostgreSQL client)
- **@supabase/supabase-js**: 2.99.x (Supabase client)
- **@react-email/components**: 1.0.x (email template components)
- **@react-email/render**: 2.0.x (email rendering)

### Key Files

| Purpose | File |
|---------|------|
| Next.js config | `next.config.ts` |
| Request logging | `proxy.ts` |
| TypeScript config | `tsconfig.json` |
| Tailwind CSS | `app/styles/globals.css` (CSS-first config) |
| Environment vars | `data/env/server.ts`, `data/env/client.ts` |
| Vitest config | `vitest.config.ts` |
| Storybook config | `.storybook/` |
| Drizzle config | `drizzle.config.ts` |
| DB client | `lib/supabase/db.ts` (server-only) |
| DB schema | `lib/supabase/schema.ts` (central exports) |
| Action types | `lib/action-types.ts` |
| Service errors | `lib/supabase/errors.ts`, `lib/services/errors.ts` |

### Path Aliases

Use `~/` prefix for absolute imports (configured in tsconfig.json):

```typescript
import logger from "~/lib/logger";
import { env } from "~/data/env/server";
```

### Key Directories

- **app/**: Next.js App Router pages, layouts, and API routes
- **features/**: Feature-based modules (see structure below)
- **components/**: Shared reusable components (ui/, layout/, providers/)
- **lib/**: Utilities and configurations (logger, supabase)
- **lib/supabase/**: Drizzle ORM client (`db.ts`), central schema exports (`schema.ts`) — server-only
- **data/env/**: T3 Env type-safe environment variables (server.ts, client.ts)
- **constants/**: Static data and configuration constants
- **tests/e2e/**: Playwright E2E tests (\*.e2e.ts pattern)
- **tests/unit/**: Vitest unit tests (\*.test.ts pattern)
- **tests/integration/**: Storybook integration tests

### App Router Route Groups

The `app/` directory uses Next.js route groups to organize pages by concern:

- **`(auth)/`** -- Authentication pages (sign-in, sign-up, forgot-password, sso-callback)
- **`(marketing)/`** -- Public pages (landing, about, contact, pricing, features, legal)
- **`(onboarding)/`** -- Onboarding flow pages
- **`app/`** -- Protected dashboard area (authenticated users)
- **`api/`** -- API route handlers (health endpoint)

Each route group has its own layout for scoped UI chrome.

### Feature Module Structure

Features follow a **feature-driven architecture** where each domain is self-contained.

**Current Features:**
- **auth**: Authentication flows (sign-in, sign-up, forgot-password, email verification)
- **billing**: Plan detection and feature gating based on subscription plan
- **contact**: Complete contact feature (form, validation, email sending)
- **contractor**: Contractor profile and email template management
- **crm**: Client management system
- **marketing**: Pure presentation/layout components (hero, features, about sections)
- **onboarding**: 6-step onboarding flow (plans → company-details → branding → template → email → summary)
- **pricing**: Pricing display and related components
- **projects**: Project and project steps management (linked to clients)
- **templates**: Custom template management with configurable steps

**Feature Directory Layout:**
```
features/{domain}/
├── components/
│   ├── {component}.tsx
│   ├── {component}.stories.tsx     # co-located with component
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

**Import Rules:**
- Import directly from sub-paths: `import { TemplateCard } from "~/features/templates/components"` ✓
- **No top-level feature `index.ts`** — `import { X } from "~/features/templates"` ✗
- `features/{domain}/components/index.tsx` is the only allowed barrel, and exports components only

### Layer Architecture

```
Action → Service → Permission → DB
             ↓
           Schema (Zod)    DB schema (Drizzle)
```

Each layer imports only downward.

**Return types per layer:**

| Layer | Type |
|-------|------|
| DB queries / mutations | `SupabaseServiceResult<T>` → `[SupabaseServiceError, null] \| [null, T]` |
| Permissions | `SupabaseServiceResult<void>` |
| Service reads | `SupabaseServiceResult<T>` — wrap with React `cache()` |
| Service mutations | `ServiceResult<BaseServiceError, T>` |
| Actions | `ActionResponse<T>` or `RedirectAction` from `~/lib/action-types` |

Import sources:
- `~/lib/supabase/errors` — `SupabaseServiceResult`, `SupabaseServiceError`, `categorizeSupabaseError`
- `~/lib/services/errors` — `ServiceResult`, `BaseServiceError`
- `~/lib/action-types` — `ActionResponse`, `RedirectAction`, `isActionSuccess`, `isActionFailed`

**Service mutation guard chain (always in this order):**
```ts
const [roleErr] = await requireRole(userId, [Role.CONTRACTOR]);
if (roleErr) return [roleErr, null];

const [profileErr, profile] = await getCachedContractorProfile(userId);
if (profileErr) return [profileErr, null];

const [permErr] = await canAddTemplate(profile.id);
if (permErr) return [permErr, null];

const [dbErr, result] = await ...;
if (dbErr) return [dbErr, null];

return [null, result];
```

**Server Action pattern:**
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
- `map-service-error.ts` translates `BaseServiceError.code` to Polish user strings.

**DB layer rules:**
- `categorizeSupabaseError(error, "ResourceName")` in every `catch` block.
- Multi-step writes use `db.transaction()`.
- Register new tables in `lib/supabase/schema.ts`.

### Environment Variables

Environment variables are validated at build-time using T3 Env:

- Server variables: `data/env/server.ts` (NODE_ENV, CLERK_SECRET_KEY, RESEND_API_KEY, CONTACT_EMAIL_TO, LOG_LEVEL, DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, etc.)
- Client variables: `data/env/client.ts` (must be prefixed with `NEXT_PUBLIC_`, e.g., NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
- Skip validation with `SKIP_ENV_VALIDATION=true` (useful for Docker builds)
- Empty strings are treated as undefined for type safety

### Logging

Uses Pino logger (`lib/logger.ts`).

```typescript
import logger, { createLogger } from "~/lib/logger";
const logger = createLogger({ module: "templates-service" });
logger.info({ userId, templateId }, "Template created successfully");
logger.error({ userId, operation: "createTemplate", errorCode: err.code }, "DB insert failed");
```

Always include `userId`, `operation`, and `errorCode` on failures. Log at the layer where the error originates — do not re-log higher up. Log levels controlled via `LOG_LEVEL` env var.

### Database

Uses **Drizzle ORM** with **PostgreSQL** hosted on Supabase. All tables are contractor-centric:

```
contractorProfile (PK: id)
├─ onboardingState (FK: contractorId)
├─ clients (FK: contractorId)
│  └─ projects (FK: clientId, contractorId)
│     └─ projectSteps (FK: projectId)
├─ templates (FK: contractorId)
│  └─ templateSteps (FK: templateId)
└─ emailTemplates (FK: contractorId)
```

Feature-level DB files live in `features/{domain}/server/db/`.
Use React `cache()` for query optimization in server components.

### Testing Configuration

Vitest 4.1 is configured with two project modes:

- **unit**: Node environment for unit tests (`*.test.ts` files), setup: `tests/unit/vitest.setup.ts`
- **storybook**: Browser environment (Playwright/Chromium) for Storybook component tests, setup: `tests/integration/vitest.setup.ts`

**Storybook stories** use CSF Next format with `preview.meta()` / `meta.story()` and `.test()` method for interaction tests:

```ts
const meta = preview.meta({ title: "Features/...", component: MyComponent });
export const Default = meta.story({ args: { ... } });
Default.test("renders correctly", async ({ canvas }) => { ... });
```

**Test data builders** use `mimicry-js` + `faker`. One builder per entity, exported from `test/builders/index.ts`. All story `args` must use builders — no hardcoded test data.

```ts
export const myBuilder = build<MyType>({
  fields: {
    id: () => faker.string.uuid(),
    name: () => faker.lorem.words(2)
  },
  traits: { withExtra: { overrides: { extra: "value" } } }
});
```

### Design System

Uses `@szum-tech/design-system`. Import components directly:

```typescript
import { Button, Card, Tooltip } from "@szum-tech/design-system";
```

Icons via `lucide-react` (re-exported through design system). Button icons use `startIcon`/`endIcon` props, not children.

### Theme Support

Uses `next-themes` for dark/light/system switching. `ThemeProvider` in `app/layout.tsx`.

### Next.js Configuration

- **React Compiler enabled** (`reactCompiler: true`) — automatic memoization
- **Server Actions body limit**: 2MB
- **Health Check Endpoints**: `/healthz`, `/api/healthz`, `/health`, `/ping` all rewrite to `/api/health`
- **Image Optimization**: remote patterns for Google Images and Supabase Storage

### Integrations & Services

- **Clerk**: Authentication (@clerk/nextjs) — `CLERK_SECRET_KEY` + `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- **Resend**: Transactional email — `RESEND_API_KEY`
- **@axe-core/playwright**: Accessibility testing in E2E tests

## Conventions

- Commits follow [Conventional Commits](https://www.conventionalcommits.org/) for semantic release
- ESLint: Uses `@szum-tech/eslint-config`
- Prettier: Uses `@szum-tech/prettier-config`
- **TypeScript strict mode** with `noUncheckedIndexedAccess` — always handle undefined array/object access explicitly
- **Server-only code protection**: Use `import "server-only"` in modules that must never run on the client
- UI strings are in Polish

## Common Pitfalls

| Area | Don't | Do |
|------|-------|----|
| Components | Add `'use client'` unnecessarily | Default to Server Components |
| Memoization | Use `useMemo`/`useCallback`/`memo` | Let React Compiler optimize automatically |
| Imports | Use relative paths (`../../../lib/utils`) | Use path aliases (`~/lib/utils`) |
| Feature imports | Import from feature root (`~/features/templates`) | Import from sub-paths (`~/features/templates/components`) |
| Logging | Use `console.log` in production code | Use structured Pino logging |
| `useFormStatus` | Use in same component as `<form>` | Use in a child component inside the form |
| Server Actions | Return untyped objects | Use `ActionResponse<T>` or `RedirectAction` |
| TypeScript | Ignore `noUncheckedIndexedAccess` warnings | Handle undefined array/object access explicitly |
| Env Variables | Skip validation in production | Use T3 Env for type-safe validation |
| Icons | Import from random icon packages | Use `lucide-react` (re-exported via design system) |
| React Hook Form child components | Read `form.formState.errors` from prop directly | Use `useFormState({ control: form.control })` in child — React Compiler memoizes children, blocking re-renders when parent form state changes |
| Storybook test queries | `getByText("Wybierz branżę")` when Select placeholder matches error text | `getByText("...", { selector: '[data-slot="field-error"]' })` to target the error element specifically |
| Nullable form fields | Omit nullable fields from `defaultValues` | Always include nullable fields as `null` — Zod `z.nullable()` rejects `undefined` |

## New Feature Checklist

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

## CI/CD & GitHub Actions

The project includes several GitHub Actions workflows in `.github/workflows/`:

- **PR Check** (`pr-check.yml`): Validates builds, linting, formatting, types, and tests on every PR
- **Code Review** (`code-review.yml`): AI-powered code reviews using OpenAI (requires OPENAI_API_KEY secret)
- **Publish** (`publish.yml`): Automated semantic releases when merging to main branch

All workflows use `npm` as the package manager.

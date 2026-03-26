# Project Context

This file contains project-specific configuration for Claude Code.
When using this configuration in other projects, update this file with your project's specifics.

## Tech Stack

| Category | Technology | Version | Status |
|----------|------------|---------|--------|
| Framework | Next.js | 16.2.1 (App Router, Turbopack) | ✅ Installed |
| UI Library | React | 19.2.0 (with React Compiler) | ✅ Installed |
| Styling | Tailwind CSS | 4.1.11 (CSS-first config) | ✅ Installed |
| Design System | @szum-tech/design-system | 3.15.0 (shadcn/ui based) | ✅ Installed |
| Type Safety | TypeScript | 5.9.3 (strict mode) | ✅ Installed |
| Env Validation | T3 Env | @t3-oss/env-nextjs 0.13.8 | ✅ Installed |
| Logging | Pino | 10.3.0 (pretty-printing in dev) | ✅ Installed |
| Forms | React Hook Form | 7.71.1 | ✅ Installed |
| Validation | Zod | 4.3.6 | ✅ Installed |
| Theme | next-themes | 0.4.6 | ✅ Installed |
| Auth | @clerk/nextjs | 7.0.6 | ✅ Installed |
| Email | Resend | 6.9.3 | ✅ Installed |
| ORM | drizzle-orm | 0.45.x | ✅ Installed |
| Database | postgres (postgres-js) | 3.4.x | ✅ Installed |
| Database Host | @supabase/supabase-js | 2.99.x | ✅ Installed |
| Email Templates | @react-email/components | 1.0.x | ✅ Installed |
| Email Rendering | @react-email/render | 2.0.x | ✅ Installed |

## Testing Stack

| Type | Tool | Location | Command |
|------|------|----------|---------|
| Unit | Vitest 4.0 | `tests/unit/`, `*.test.ts` | `npm run test:unit` |
| Component | Storybook 10 + Vitest | `*.stories.tsx` | `npm run test:storybook` |
| E2E | Playwright 1.58 | `tests/e2e/` | `npm run test:e2e` |
| All | Vitest | - | `npm run test` |

## Key Files

| Purpose | File |
|---------|------|
| Next.js config | `next.config.ts` |
| Request logging | `proxy.ts` |
| Dependencies | `package.json` |
| TypeScript | `tsconfig.json` |
| Tailwind | `app/styles/globals.css` (CSS-first config) |
| Environment vars | `data/env/server.ts`, `data/env/client.ts` |
| Vitest config | `vitest.config.ts` |
| Storybook | `.storybook/` |
| Drizzle config | `drizzle.config.ts` |
| DB client | `lib/supabase/db.ts` (server-only) |
| DB schema | `lib/supabase/schema.ts` (central schema exports) |

## Import Conventions

```typescript
// Path alias (use ~/ for all project imports)
import { createLogger } from "~/lib/logger";
import { env } from "~/data/env/server";

// Design system
import { Button, Card } from "@szum-tech/design-system";

// Icons (lucide-react, re-exported via design system)
import { GithubIcon, SparklesIcon } from "lucide-react";

// Server-only code
import "server-only";
```

## Component Location

- **Shared components**: `components/`
  - `components/providers/` - Context providers (e.g., ThemeProvider)
  - `components/ui/` - Reusable UI components (e.g., ThemeToggle, icons)
- **Feature components**: `features/[feature]/components/`
- **Stories**: Same directory as component (`component.stories.tsx`)

## Feature Module Structure

Features follow a modular architecture pattern:

```
features/
└── [feature-name]/
    ├── components/       # Feature-specific components
    ├── constants/        # Static data
    ├── schemas/          # Zod validation schemas
    └── server/           # Server-side logic
        ├── actions/      # Server Actions
        ├── db/           # Drizzle schema, queries, mutations
        └── services/     # Business logic (plan gating, step navigation, etc.)
```

## Database

Drizzle ORM + PostgreSQL via Supabase.

- **DB client**: `lib/supabase/db.ts` — `import "server-only"`, uses `postgres-js`
- **Central schema**: `lib/supabase/schema.ts` — re-exports all table definitions from features
- **Feature schemas**: `features/{domain}/server/db/schema.ts` — Drizzle table definitions
- **Queries/mutations**: `features/{domain}/server/db/queries.ts` / `mutations.ts`
- **Migrations**: `npx drizzle-kit generate` / `npx drizzle-kit migrate`

Use React `cache()` for read queries in Server Components.

## Logging

Use Pino via `createLogger({ module: "feature-name" })`.

Request logging is handled automatically via `proxy.ts` with request ID tracking.

## React 19 & Compiler

React Compiler enabled in `next.config.ts` — removes need for manual memoization. Keep `useMemo`/`useCallback` only for: external library callbacks, complex context values, >100ms computations. Server Components by default; add `"use client"` only when interactivity is needed.

## Forms

- Complex forms: React Hook Form + Zod
- Simple forms: `useActionState` from React 19
- Server Actions: Use standardized response types with Zod validation

**Server Action location:** `features/[feature]/server/actions/[action-name].ts`

## Theme Support

The app uses `next-themes` for dark/light/system theme switching:
- `ThemeProvider` wraps the app in `app/layout.tsx`
- `ThemeToggle` component for user switching
- Theme is persisted in localStorage

## Common Pitfalls

| Area | Don't | Do |
|------|-------|----|
| Components | Add `'use client'` unnecessarily | Default to Server Components |
| Memoization | Use `useMemo`/`useCallback`/`memo` with React Compiler | Let compiler optimize automatically |
| Imports | Use relative paths (`../../../lib/utils`) | Use path aliases (`~/lib/utils`) |
| Logging | Use `console.log` in production code | Use structured Pino logging (`logger.info(...)`) |
| `useFormStatus` | Use in same component as `<form>` | Use in a child component inside the form |
| Server Actions | Return untyped objects | Use standardized response types with Zod validation |
| Icons | Import from lucide-react directly | It's re-exported via design-system |

## Current Features

| Feature | Description |
|---------|-------------|
| auth | Authentication flows (sign-in, sign-up, forgot-password, email verification) via Clerk |
| billing | Plan detection and feature gating based on subscription plan |
| contact | Complete contact feature (form, validation, email sending via Resend) |
| contractor | Contractor profile and email template management |
| crm | Client management system |
| marketing | Pure presentation/layout components (hero, features, about, legal sections) |
| onboarding | 6-step onboarding flow: plans → company-details → branding → template → email → summary |
| pricing | Pricing display and related components |
| projects | Project and project steps management (linked to clients) |
| templates | Custom template management with configurable steps |
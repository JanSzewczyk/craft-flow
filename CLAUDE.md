# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Craft Flow is an enterprise-ready Next.js 16.1.4 template with React 19.2.0, TypeScript, Tailwind CSS 4.1.11,
React Compiler, and comprehensive testing infrastructure (Vitest 4.0, Playwright 1.56).

## Commands (Bun)

### Development

```bash
bun run dev          # Start dev server with Bun
bun run build        # Production build with Bun
bun run start        # Start production server with Bun
```

### Package Management

```bash
bun install          # Install dependencies
bun add <package>    # Add dependency
bun add -d <package> # Add dev dependency
bun update           # Update dependencies
```

### Code Quality

```bash
bun run lint         # ESLint check
bun run lint:fix     # ESLint with auto-fix
bun run prettier:check   # Prettier check
bun run prettier:write   # Prettier with auto-fix
bun run type-check   # TypeScript type checking
```

### Testing

```bash
bun run test                  # Run all Vitest tests
bun run test:ci               # Run tests for CI environment
bun run test:coverage         # Generate test coverage report
bun run test:unit             # Unit tests only (with coverage)
bun run test:watch            # Watch mode
bun run test:ui               # Vitest UI
bun run test:storybook        # Storybook component tests (with coverage)

# Run a single test file
bun run vitest run path/to/file.test.ts
bun run vitest run --project=unit path/to/file.test.ts

# E2E tests (Playwright) - requires build first
bun run build && bun run test:e2e
bun run test:e2e:ci          # E2E tests for CI environment
bun run test:e2e:ui          # Playwright UI mode
```

### Storybook

```bash
bun run storybook:dev         # Start Storybook (port 6006)
bun run storybook:build       # Build static Storybook
bun run storybook:serve       # Serve built Storybook
bun run test:storybook        # Run Storybook component tests
```

### Analysis

```bash
bun run analyze               # Bundle analyzer
```

## Bun Runtime Notes

This project is configured to run with Bun runtime:
- Uses `bun --bun` flag for Next.js commands to force Bun runtime
- Bun's package manager is npm-compatible and uses node_modules
- Environment variables work via `process.env` and Bun.env automatically
- Pino logging is externalized via `serverExternalPackages` configuration

### Alternative: Node.js/npm

This project still supports Node.js 24.x and npm if needed:

```bash
npm install
npm run dev
```

Bun is recommended for improved performance (10-100x faster installs, 2-3x faster dev server startup).

## Architecture

### Tech Stack

- **Next.js**: 16.1.4 (App Router, Turbopack, React Compiler)
- **React**: 19.2.0 with React Compiler enabled
- **TypeScript**: 5.9.3 (strict mode with `noUncheckedIndexedAccess`)
- **Tailwind CSS**: 4.1.11 (CSS-first config)
- **@szum-tech/design-system**: 3.12.3
- **Vitest**: 4.0.16 (unit & integration tests)
- **Playwright**: 1.58.0 (E2E tests)
- **Storybook**: 10.1.11 (component development)
- **Zod**: 4.3.6 (validation)
- **Pino**: 10.3.0 (logging)
- **next-themes**: 0.4.6 (theming)
- **@clerk/nextjs**: 7.0.4 (authentication)
- **react-hook-form**: 7.71.1 (form handling)
- **Resend**: 6.9.3 (email service)

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
- **lib/**: Utilities and configurations (logger)
- **data/env/**: T3 Env type-safe environment variables (server.ts, client.ts)
- **constants/**: Static data and configuration constants
- **tests/e2e/**: Playwright E2E tests (\*.e2e.ts pattern)
- **tests/unit/**: Vitest unit tests (\*.test.ts pattern)
- **tests/integration/**: Storybook integration tests

### Feature Module Structure

Features follow a modular architecture pattern. Current features include:
- **marketing**: Marketing pages and components (hero, features, about, contact sections)
- **pricing**: Pricing page and related components
- **contact**: Contact form and related functionality
- **example-feature**: Template feature for reference

```
features/
└── marketing/
    ├── components/    # Feature-specific components with co-located stories
    │   ├── about/     # About page components
    │   ├── features/  # Features showcase components
    │   └── contact/  # Contact section components
    └── constants/     # Feature-specific constants (e.g., team data)
```

### Environment Variables

Environment variables are validated at build-time using T3 Env:

- Server variables: `data/env/server.ts` (NODE_ENV, CLERK_SECRET_KEY, RESEND_API_KEY, CONTACT_EMAIL_TO, LOG_LEVEL, etc.)
- Client variables: `data/env/client.ts` (must be prefixed with `NEXT_PUBLIC_`, e.g., NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
- Skip validation with `SKIP_ENV_VALIDATION=true` (useful for Docker builds)
- Empty strings are treated as undefined for type safety

### Logging

Uses Pino logger (`lib/logger.ts`) with different behavior based on environment:

**Development**: Uses `pino-pretty` transport for readable, colored output
**Production**: Structured JSON logs for log aggregation services

Create child loggers with context:

```typescript
import logger, { createLogger } from "~/lib/logger";
const apiLogger = createLogger({ module: "api" });
```

Log levels controlled via `LOG_LEVEL` env var (fatal, error, warn, info, debug, trace).
Request logging is handled automatically via `proxy.ts` with request ID tracking.

### Testing Configuration

Vitest 4.0 is configured with two project modes:

- **unit**: Node environment for unit tests (`*.test.ts` files) with setup file `tests/unit/vitest.setup.ts`
- **storybook**: Browser environment (Playwright) for Storybook component tests with setup file `tests/integration/vitest.setup.ts`

Coverage reports include: text, HTML, JSON-summary, and JSON formats.
Storybook tests use play functions for interaction testing with accessibility checks via @storybook/addon-a11y.
Use `test-only` tag for stories that should be excluded from docs but run in tests.

### Design System

Uses `@szum-tech/design-system` package. Import components directly:

```typescript
import { Button, Card, Tooltip } from "@szum-tech/design-system";
```

Icons are re-exported via lucide-react through the design system:

```typescript
import { GithubIcon, SparklesIcon } from "lucide-react";
```

UI components are located in `components/ui/` with co-located Storybook stories (`*.stories.tsx`).

### Health Checks

Built-in health endpoint at `/api/health` with multiple URL aliases: `/healthz`, `/api/healthz`, `/health`, `/ping`

### Theme Support

The app uses `next-themes` for dark/light/system theme switching:
- `ThemeProvider` wraps the app in `app/layout.tsx`
- `ThemeToggle` component (`components/ui/theme-toggle.tsx`) for user switching
- Theme is persisted in localStorage
- Storybook includes dark mode toggle via `@storybook-community/storybook-dark-mode`

### Next.js Configuration

Key Next.js configuration details:

- **React Compiler enabled** (`reactCompiler: true`) - automatic optimization of components
- **Server External Packages**: Pino and pino-pretty are externalized for server-side logging
- **Bundle Analyzer**: Available via `ANALYZE=true` environment variable
- **Health Check Endpoints**: Multiple URL aliases rewrites to `/api/health`: `/healthz`, `/api/healthz`, `/health`, `/ping`
- **Image Optimization**: Configured remote patterns for Google Images
- **Strict Mode**: React strict mode enabled for development warnings

### Integrations & Services

- **Clerk**: Authentication service (@clerk/nextjs) - requires CLERK_SECRET_KEY and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- **Resend**: Email service for transactional emails - requires RESEND_API_KEY
- **React Hook Form**: Form handling and validation
- **@axe-core/playwright**: Accessibility testing in Playwright E2E tests

## Conventions

- Commits follow [Conventional Commits](https://www.conventionalcommits.org/) for semantic release
- ESLint: Uses `@szum-tech/eslint-config`
- Prettier: Uses `@szum-tech/prettier-config`
- Semantic Release: Uses `@szum-tech/semantic-release-config`
- **TypeScript strict mode** with `noUncheckedIndexedAccess` enabled - safer array/object access
- **Server-only code protection**: Use `import "server-only"` in modules that should never run on the client

## Common Pitfalls

| Area | Don't | Do |
|------|-------|----|
| Components | Add `'use client'` unnecessarily | Default to Server Components |
| Memoization | Use `useMemo`/`useCallback`/`memo` with React Compiler | Let compiler optimize automatically |
| Imports | Use relative paths (`../../../lib/utils`) | Use path aliases (`~/lib/utils`) |
| Logging | Use `console.log` in production code | Use structured Pino logging (`logger.info(...)`) |
| `useFormStatus` | Use in same component as `<form>` | Use in a child component inside the form |
| Server Actions | Return untyped objects | Use standardized response types with Zod validation |
| TypeScript | Ignore `noUncheckedIndexedAccess` warnings | Handle undefined array/object access explicitly |
| Env Variables | Skip validation in production | Use T3 Env for type-safe validation |

## CI/CD & GitHub Actions

The project includes several GitHub Actions workflows in `.github/workflows/`:

- **PR Check** (`pr-check.yml`): Validates builds, linting, formatting, types, and tests on every PR
- **Code Review** (`code-review.yml`): AI-powered code reviews using OpenAI (requires OPENAI_API_KEY secret)
- **Publish** (`publish.yml`): Automated semantic releases when merging to main branch (requires configuration)

All workflows use `bun` as the runtime for optimal performance.

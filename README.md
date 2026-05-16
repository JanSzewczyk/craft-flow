<div align="center">

# 🔨 CraftFlow

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=github&utm_campaign=craft-flow)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/JanSzewczyk/craft-flow/actions/workflows/pr-check.yml/badge.svg)](https://github.com/JanSzewczyk/craft-flow/actions/workflows/pr-check.yml)

**A SaaS platform for craftsmen — create project timelines and share progress with clients via a single link**

[Product](#-product) • [Getting Started](#-getting-started) • [Documentation](#-table-of-contents) •
[Deployment](#-deployment)

</div>

---

## 👋 What is CraftFlow?

**Problem:** Craftsmen (carpenters, plumbers, finishers) waste time answering client questions ("What stage is my order
at?"). Documents, contracts, and job-site photos are scattered across SMS messages, emails, and chat apps.

**Solution:** CraftFlow is a simple B2B2C SaaS platform that lets a craftsman create a **project timeline** and share it
with a client via a single link. The client sees real-time progress, while the contractor manages all their jobs in one
place.

**Growth model (PLG):** Clients receive the link as Guests but are encouraged to create a free account to save their
renovation history forever. By signing up, they enter the CraftFlow ecosystem — becoming a free marketing channel.

## ✨ Product

### 🧑‍🔧 Contractor Zone (`/app/*`)

- **📋 Project Management** — Paginated job list, create new projects, and assign them to clients
- **🗓️ Project Timeline** — Add execution stages, mark them as complete, and track progress
- **📁 Files & Attachments** — Upload contracts (PDF) and photos (JPEG/PNG/WEBP); Supabase Storage serves optimized
  thumbnails
- **📄 Templates (`/app/templates`)** — Project "recipes" (e.g. "Window Installation") copied via Deep Copy — template
  changes don't affect existing projects
- **👥 Client CRM (`/app/clients`)** — Contact database; relational protection prevents deleting clients with active
  projects
- **🎨 Branding (`/app/branding`)** — Customize logo, primary color, and default email message shown in the client
  portal

### 👁️ Client View & PLG Mechanics

- **🔗 Guest View (`/status/[publicToken]`)** — Clean, read-only project view with contractor branding; a Data Mock
  Object (DMO) protects internal notes from unauthorized access
- **🚪 Authwall (PLG)** — A prompt on the timeline encouraging clients to sign up to "save their renovation history
  forever"
- **✨ Account Auto-Linking** — When a client signs up, the server searches their email across all CRM databases and
  links historical projects to their global Clerk ID
- **🖥️ Client Portal (`/client/*`)** — Registered client dashboard with active jobs and history views

### 💳 Subscriptions & Limits (Stripe)

B2B subscription model with a 14-day trial:

| Plan         | Active Projects | Templates | Branding    |
| ------------ | --------------- | --------- | ----------- |
| **Basic**    | 5               | 2         | Locked      |
| **Standard** | 20              | 10        | ✅ Unlocked |
| **Premium**  | Unlimited       | Unlimited | ✅ Unlocked |

### 🏗️ Onboarding & Authorization

- **Role-based Registration** — Sign-up form assigns `publicMetadata.roles: ["contractor"]` in Clerk
- **Plan Selection** — Stripe Checkout is enforced before entering the dashboard
- **Stepper State Persistence** — Onboarding progress is saved to the database, preventing data loss on refresh
- **Middleware Protection** — Middleware blocks `/app/*` for users without `onboardingComplete: true` and an active plan

### 🔐 Admin Panel

Available only after assigning the `admin` role in Clerk:

- KPI overview: number of active contractors, MRR, PLG growth
- Ability to ban a contractor account and provide technical support (Impersonate)

---

## 🛠️ Tech Stack

### 🏗️ Core

- **⚡ [Next.js 16](https://nextjs.org/)** — App Router, Turbopack, React Compiler (automatic memoization)
- **⚛️ [React 19](https://react.dev/)** — React Server Components and Server Actions
- **🛠️ [TypeScript 6](https://www.typescriptlang.org/)** — Strict mode, `noUncheckedIndexedAccess`, `ts-reset`
- **💅 [Tailwind CSS 4](https://tailwindcss.com/)** — CSS-first configuration with
  [@szum-tech/design-system](https://www.npmjs.com/package/@szum-tech/design-system)
- **🔐 [Clerk](https://clerk.com/)** — Authentication with Custom UI (hooks: `useSignIn`, `useSignUp`)
- **🗄️ [Drizzle ORM](https://orm.drizzle.team/)** — Type-safe SQL on PostgreSQL hosted in
  [Supabase](https://supabase.com/)
- **💳 [Stripe](https://stripe.com/)** — Billing, Checkout, subscription webhooks
- **📧 [Resend](https://resend.com/) + [React Email](https://react.email/)** — Transactional emails rendered as React
  components
- **📝 [Pino](https://getpino.io/)** — High-performance structured JSON logging
- **🧩 [T3 Env](https://env.t3.gg/)** — Build-time validated, type-safe environment variables

### 🧪 Testing & Quality

- **🧪 [Vitest 4](https://vitest.dev/)** — Dual-project setup: `unit` (Node) and `storybook` (Playwright/Chromium)
- **🎭 [Playwright](https://playwright.dev/)** — E2E tests with accessibility checks via `@axe-core/playwright`
- **📚 [Storybook 10](https://storybook.js.org/)** — Browser-rendered interaction tests in CSF Next format
- **✨ [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)** — Pre-configured with
  [@szum-tech](https://www.npmjs.com/package/@szum-tech/eslint-config) configs

### 🤖 Automation

- **🚀 [GitHub Actions](https://github.com/features/actions)** — PR check, AI code review, automated releases
- **🚢 [Semantic Release](https://github.com/semantic-release/semantic-release)** — Versioning and changelog on merge to
  `main`

---

## 📖 Table of Contents

- [✨ Product](#-product)
- [🛠️ Tech Stack](#️-tech-stack)
- [🎯 Getting Started](#-getting-started)
- [🚀 Deployment](#-deployment)
- [📃 Scripts Overview](#-scripts-overview)
- [🧪 Testing](#-testing)
- [🎨 Styling & Design System](#-styling--design-system)
- [💻 Environment Variables](#-environment-variables)
- [📝 Logging](#-logging)
- [🚀 GitHub Actions](#-github-actions)
- [🔒 Server-only Code](#-server-only-code)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)
- [📧 Contact & Support](#-contact--support)

---

## 🎯 Getting Started

### 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** (version 18.x or higher)
- **npm** package manager
- **Git** for version control
- A [Clerk](https://clerk.com/) account — authentication
- A [Supabase](https://supabase.com/) project — PostgreSQL database and file storage
- A [Resend](https://resend.com/) account — transactional email
- A [Stripe](https://stripe.com/) account — subscriptions and payments

### 📦 Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/JanSzewczyk/craft-flow.git
cd craft-flow
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database (Supabase)
DATABASE_URL=postgresql://...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Email (Resend)
RESEND_API_KEY=re_...
CONTACT_EMAIL_TO=your@email.com

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Logging
LOG_LEVEL=info
```

#### 4. Set Up the Database

```bash
npm run db:generate
npm run db:migrate
```

#### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment

Deploy to **Vercel** with a single click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=github&utm_campaign=craft-flow)

### Deployment Steps

1. Click the "Deploy with Vercel" button
2. Connect your GitHub repository
3. Configure environment variables in the Vercel dashboard
4. Deploy — your application goes live with automatic CI/CD

---

## 📃 Scripts Overview

### 🛠️ Development

| Script            | Description                             |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Start development server with Turbopack |
| `npm run build`   | Production build                        |
| `npm run start`   | Start production server                 |
| `npm run analyze` | Bundle analyzer (client, server, edge)  |

### 🗄️ Database

| Script                | Description                                     |
| --------------------- | ----------------------------------------------- |
| `npm run db:generate` | Generate Drizzle migrations from schema changes |
| `npm run db:migrate`  | Apply pending migrations                        |
| `npm run db:push`     | Push schema directly (dev only)                 |
| `npm run db:studio`   | Open Drizzle Studio GUI                         |

### 🧹 Code Quality

| Script                   | Description           |
| ------------------------ | --------------------- |
| `npm run lint`           | ESLint check          |
| `npm run lint:fix`       | ESLint auto-fix       |
| `npm run prettier:check` | Prettier format check |
| `npm run prettier:write` | Prettier auto-fix     |
| `npm run type-check`     | TypeScript type check |

### 🧪 Testing

| Script                   | Description                           |
| ------------------------ | ------------------------------------- |
| `npm run test`           | Run all Vitest tests                  |
| `npm run test:ci`        | Tests with coverage for CI            |
| `npm run test:coverage`  | Generate coverage report              |
| `npm run test:unit`      | Unit tests only                       |
| `npm run test:watch`     | Watch mode                            |
| `npm run test:storybook` | Storybook component tests             |
| `npm run test:e2e`       | Playwright E2E tests (requires build) |
| `npm run test:e2e:ui`    | Playwright UI mode                    |

### 📚 Storybook

| Script                    | Description                  |
| ------------------------- | ---------------------------- |
| `npm run storybook:dev`   | Start Storybook on port 6006 |
| `npm run storybook:build` | Build static Storybook       |
| `npm run storybook:serve` | Serve built Storybook        |

---

## 🧪 Testing

CraftFlow has a three-layer testing infrastructure.

### 🔬 Unit Tests (Vitest — Node environment)

```bash
npm run test:unit
```

Unit tests live in `tests/unit/` using the `*.test.ts` pattern. Run a single file:

```bash
npx vitest run --project=unit path/to/file.test.ts
```

### 🧩 Component Tests (Vitest + Storybook — Playwright/Chromium)

```bash
npm run test:storybook
```

Storybook interaction tests run in a real browser. Stories use CSF Next format with the `.test()` method:

```typescript
const meta = preview.meta({ title: "Features/...", component: MyComponent });
export const Default = meta.story({ args: { ... } });
Default.test("renders correctly", async ({ canvas }) => { ... });
```

### 🎭 End-to-End Tests (Playwright)

Build the app first, then run the tests:

```bash
npm run build && npm run test:e2e
```

Playwright UI mode for debugging:

```bash
npm run test:e2e:ui
```

---

## 🎨 Styling & Design System

CraftFlow uses **[Tailwind CSS 4](https://tailwindcss.com/)** with a CSS-first configuration and the
**[Szum-Tech Design System](https://www.npmjs.com/package/@szum-tech/design-system)**, which provides:

- ✅ Ready-made components built on [Radix UI](https://www.radix-ui.com/)
- 🎨 OKLCH semantic color tokens and design tokens
- 🌙 Dark mode support via `next-themes`
- 📖 [Component documentation](https://szum-tech-design-system.vercel.app/?path=/docs/components--docs)

### Usage

```typescript
import { Button, Card, Tooltip } from "@szum-tech/design-system";
```

Icons are provided via `lucide-react` (re-exported through the design system). Use `startIcon`/`endIcon` props on
`Button` — not children.

---

## 💻 Environment Variables

[T3 Env](https://env.t3.gg/) provides build-time validation of environment variables.

### Configuration Files

- **`data/env/server.ts`** — Server-only variables (CLERK_SECRET_KEY, RESEND_API_KEY, DATABASE_URL, SUPABASE_URL,
  STRIPE_SECRET_KEY, LOG_LEVEL, etc.)
- **`data/env/client.ts`** — Client-safe variables (must use `NEXT_PUBLIC_` prefix)

### Benefits

- ✅ Fully typed access across the entire codebase
- ✅ Build-time validation — missing variables fail fast
- ✅ Empty strings treated as `undefined`
- ✅ Skip validation in Docker builds with `SKIP_ENV_VALIDATION=true`

---

## 📝 Logging

CraftFlow uses **[Pino](https://getpino.io/)** for structured JSON logging.

### Usage

```typescript
import logger, { createLogger } from "~/lib/logger";

const moduleLogger = createLogger({ module: "projects-service" });
moduleLogger.info({ userId, projectId }, "Project created successfully");
moduleLogger.error({ userId, operation: "createProject", errorCode: err.code }, "DB insert failed");
```

### Log Levels

```bash
LOG_LEVEL=fatal   # Fatal errors only
LOG_LEVEL=error   # Errors and above
LOG_LEVEL=warn    # Warnings and above
LOG_LEVEL=info    # Info and above (default)
LOG_LEVEL=debug   # Debug messages and above
LOG_LEVEL=trace   # Everything
```

### Built-in Logging

- **Request logging** — `proxy.ts` logs method, URL, status, and response time with a unique `X-Request-ID` header
- **Health check** — `app/api/health/route.ts` logs at info/debug/error levels
- **Error handlers** — `app/error.tsx` and `app/global-error.tsx` capture and log page and application errors

---

## 🚀 GitHub Actions

### Available Workflows

#### 1. ✅ PR Check (`pr-check.yml`)

Runs on every pull request:

- 🏗️ **Build** — Verifies the project builds successfully
- 🧹 **Prettier** — Code formatting
- ⬣ **ESLint** — Code quality and linting
- 🛠️ **TypeScript** — Type checking
- 🧪 **Tests** — Unit and Storybook component tests
- 🎭 **Playwright** — E2E tests

#### 2. 🤖 AI Code Review (`code-review.yml`)

Automated code review on every PR via OpenAI (requires `OPENAI_API_KEY` secret).

#### 3. 🚢 Publish (`publish.yml`)

Triggered on merge to `main`:

- 📦 Determines next version via [Semantic Release](https://github.com/semantic-release/semantic-release) +
  [Conventional Commits](https://www.conventionalcommits.org/)
- 📝 Updates `CHANGELOG.md`
- 🏷️ Creates a GitHub release
- 🔢 Bumps version in `package.json`

---

## 🔒 Server-only Code

The [`server-only`](https://www.npmjs.com/package/server-only) package prevents server code from leaking into the client
bundle:

```typescript
import "server-only";

export async function getSecretData() {
  // Build-time error if imported by a Client Component
}
```

The `lib/supabase/db.ts` database client uses `server-only` — it will never reach the browser.

---

## 📁 Project Structure

```
craft-flow/
├── .claude/              # Claude Code configuration (agents, skills, hooks)
├── .github/
│   └── workflows/        # GitHub Actions (pr-check, code-review, publish)
├── .storybook/           # Storybook configuration and decorators
├── app/                  # Next.js App Router
│   ├── (auth)/           # Auth pages (sign-in, sign-up, forgot-password)
│   ├── (marketing)/      # Public marketing pages
│   ├── (onboarding)/     # Onboarding flow with plan selection
│   ├── (public)/         # Public project status view (/status/[token])
│   ├── app/              # Contractor dashboard (projects, clients, templates)
│   ├── client/           # Client portal (active jobs, history)
│   └── api/              # API routes (health check)
├── components/           # Shared React components
├── constants/            # Static data and configuration
├── data/
│   └── env/              # T3 Env type-safe environment variables
├── features/             # Feature-driven modules (self-contained domains)
├── lib/
│   └── supabase/         # Drizzle ORM client and central schema exports
├── public/               # Static assets (images, fonts, icons)
├── tests/
│   ├── e2e/              # Playwright end-to-end tests
│   ├── integration/      # Storybook integration test setup
│   └── unit/             # Vitest unit tests
├── drizzle.config.ts     # Drizzle ORM configuration
├── next.config.ts        # Next.js configuration
├── playwright.config.ts  # Playwright E2E configuration
├── proxy.ts              # Request logging middleware
├── tsconfig.json         # TypeScript configuration
└── vitest.config.ts      # Vitest configuration
```

### Key Directories

- **`app/`** — App Router with route groups: auth, marketing, onboarding, contractor dashboard, and client portal
- **`features/{domain}/`** — Self-contained domain modules: `components/`, `schemas/`, `server/db/`, `server/services/`,
  `server/actions/`, `test/builders/`
- **`lib/supabase/`** — Drizzle ORM client (`db.ts`) and central schema exports (`schema.ts`) — server-only
- **`data/env/`** — T3 Env type-safe environment variable definitions
- **`tests/`** — Three test environments: unit (Node), Storybook (browser), E2E (Playwright)

### Important Configuration Files

- **`next.config.ts`** — Next.js build, React Compiler, image domains, health check rewrites
- **`drizzle.config.ts`** — ORM and migration configuration
- **`vitest.config.ts`** — Dual-project Vitest setup (unit + storybook)
- **`proxy.ts`** — Request logging middleware (not `middleware.ts`)
- **`tsconfig.json`** — TypeScript strict mode with `~/` path alias

---

## 🤝 Contributing

Contributions are welcome. Follow this flow:

1. Fork the repository
2. Create a branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/)
4. Push the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Make sure your code passes all tests and lint checks before opening a PR.

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

CraftFlow is built with amazing open-source tools and libraries:

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Vitest](https://vitest.dev/) - Next generation testing framework
- [Playwright](https://playwright.dev/) - E2E testing framework
- [Storybook](https://storybook.js.org/) - UI component explorer
- And many more amazing libraries!

---

## 📧 Contact & Support

Have questions, suggestions, or found an issue?

- 🐛 [Open an issue](https://github.com/JanSzewczyk/craft-flow/issues)
- ⭐ [Star this repository](https://github.com/JanSzewczyk/craft-flow)
- 👨‍💻 Check out my [GitHub profile](https://github.com/JanSzewczyk)

---

<div align="center">

**Made with ❤️ by [Szum-Tech](https://github.com/JanSzewczyk)**

If this project helped you, please consider giving it a ⭐ on GitHub!

[⬆ Back to Top](#-craftflow)

</div>

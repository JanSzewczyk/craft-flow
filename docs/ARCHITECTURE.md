# Architecture Guide

This document outlines the feature-driven architecture for Craft Flow.

## Feature-Driven Design

Features are organized around **business domains**, not page layouts. Each feature is self-contained with:

- UI Components
- Business logic (server actions, utilities)
- Validation schemas
- Constants and types

### Benefits

✅ **Reusability** - Features can be used across multiple pages ✅ **Clear Boundaries** - Easy to understand what
belongs to each feature ✅ **Decoupling** - Features don't have hard dependencies on each other ✅ **Scalability** -
Easy to extract features into separate packages ✅ **Testing** - Features are isolated and easier to test

## Current Features

### `features/marketing/`

Pure **presentation and marketing layout** components.

- Hero sections
- Feature showcases
- About/team information
- Pricing display (uses pricing feature)
- Testimonials
- CTA sections

**Dependencies**: Import data from other features but don't contain business logic.

### `features/contact/`

Complete **contact feature** including UI and business logic.

**Components**:

- `ContactForm` - Validated form component
- `ContactSection` - Full page section (form + FAQ)
- `ContactHeader` - Page header
- `ContactFAQ` - FAQ accordion

**Business Logic**:

- `sendContactEmail` - Server action
- `contactFormSchema` - Zod validation
- `contact-email.tsx` - Email template

**Usage**: Pages import from `~/features/contact`

### `features/pricing/`

Pricing-related features (expandable for future pricing logic).

## Import Patterns

### ✅ Good Patterns

```typescript
// Import from feature index
import { ContactForm, ContactSection } from "~/features/contact";
import { sendContactEmail } from "~/features/contact";

// Use path aliases
import logger from "~/lib/logger";
import { env } from "~/data/env/server";

// Import from specific files if needed
import { contactFormSchema } from "~/features/contact";
```

### ❌ Avoid

```typescript
// Don't import deeply nested
import { ContactForm } from "~/features/contact/components/contact-form";

// Don't create circular dependencies
// features/marketing → features/contact → features/marketing

// Don't mix business logic into presentation features
// Keep server actions in separate features, not in marketing
```

## Adding New Features

When adding a new business domain:

1. Create `features/{domain}/` directory
2. Add structure:
   ```
   features/{domain}/
   ├── components/      # UI components
   ├── constants/       # Static data
   ├── schemas/         # Validation (if needed)
   ├── server/          # Server actions, db queries
   ├── index.ts         # Clean exports
   └── README.md        # Documentation
   ```
3. Create `features/{domain}/index.ts` for clean exports
4. Document in README.md

## Dependency Rules

Use these rules to maintain clear boundaries:

| From → To                   | Allowed    | Notes                                      |
| --------------------------- | ---------- | ------------------------------------------ |
| App pages → Features        | ✅ Yes     | Pages consume features                     |
| Marketing → Contact/Pricing | ✅ Yes     | Presentation can import data from features |
| Contact → Marketing         | ❌ No      | Features shouldn't depend on marketing     |
| Feature A → Feature B       | ✅ Limited | Only import components, not internals      |
| Feature → lib               | ✅ Yes     | Always ok to use utilities                 |

## File Organization

```
craft-flow/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Marketing group
│   │   ├── page.tsx        # Home page
│   │   ├── contact/        # Contact page
│   │   └── layout.tsx
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout
├── features/               # Feature modules
│   ├── contact/            # Contact domain
│   ├── marketing/          # Marketing domain
│   └── pricing/            # Pricing domain
├── components/             # Shared components
│   ├── ui/                 # Design system components
│   └── layout/             # Layout components
├── lib/                    # Utilities
├── data/                   # Data & env
└── tests/                  # Tests
```

## Next Steps

Potential features to add following this pattern:

- `features/auth/` - Authentication logic (currently using Clerk)
- `features/dashboard/` - Dashboard feature
- `features/billing/` - Billing/subscription logic
- `features/settings/` - User settings

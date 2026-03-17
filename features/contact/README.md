# Contact Feature

Feature-driven module for contact functionality, including form handling, email sending, and related UI components.

## Structure

```
features/contact/
├── components/              # UI Components
│   ├── contact-form.tsx    # Form component with validation
│   ├── contact-header.tsx  # Page header
│   ├── contact-section.tsx # Full contact section (form + FAQ)
│   ├── contact-faq.tsx     # FAQ accordion
│   ├── templates/
│   │   └── contact-email.tsx # Email template
│   └── index.ts            # Clean exports
├── constants/
│   └── contact-faq-items.ts # FAQ data
├── schemas/
│   └── contact-schema.ts   # Zod validation schema
├── server/
│   └── actions/
│       └── send-contact-email.ts # Server action
├── index.ts                # Feature-level exports
└── README.md               # This file
```

## Usage

### Import Components

```typescript
import { ContactForm, ContactSection, ContactHeader } from "~/features/contact";
```

### Import Server Actions

```typescript
import { sendContactEmail } from "~/features/contact";
```

### Import Types

```typescript
import { type ContactFormData, contactFormSchema } from "~/features/contact";
```

## Key Files

- **contact-form.tsx**: Client component handling form submission with react-hook-form
- **send-contact-email.ts**: Server action using Resend to send emails
- **contact-schema.ts**: Zod schema validating form data
- **contact-email.tsx**: React Email template for the contact email

## Dependencies

- `react-hook-form` - Form state management
- `zod` - Validation
- `resend` - Email delivery
- `@react-email/render` - Email template rendering

## Environment Variables

Required (in `data/env/server.ts`):

- `RESEND_API_KEY` - Resend API key
- `CONTACT_EMAIL_TO` - Recipient email address

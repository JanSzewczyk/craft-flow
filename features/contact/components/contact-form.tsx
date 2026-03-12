"use client";

import * as React from "react";
import { useTransition, useState } from "react";

import { CheckCircle2, TriangleAlert } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Textarea
} from "@szum-tech/design-system";
import { contactFormSchema, type ContactFormData } from "~/features/contact/schemas/contact-schema";
import { sendContactEmail } from "~/features/contact/server/send-contact-email";

type FieldErrors = Partial<Record<keyof ContactFormData, string>>;

export function ContactForm() {
  const [result, setResult] = useState<{ success: true } | { success: false; error: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const raw = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string
    };

    const parsed = contactFormSchema.safeParse(raw);

    if (!parsed.success) {
      const errors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof ContactFormData;
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    startTransition(() => {
      sendContactEmail(parsed.data).then(setResult);
    });
  }

  function handleReset() {
    setResult(null);
    setFieldErrors({});
  }

  if (result?.success) {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center" role="status" aria-live="polite">
        <div className="bg-success/10 flex size-16 items-center justify-center rounded-full">
          <CheckCircle2 className="text-success size-8" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-heading-h3 text-foreground">Wiadomość wysłana!</p>
          <p className="text-body-default text-muted-foreground">
            Dziękujemy za wiadomość. Odezwiemy się w ciągu 48 godzin.
          </p>
        </div>
        <Button variant="outline" onClick={handleReset}>
          Wyślij kolejną wiadomość
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {result && !result.success && (
        <Alert variant="destructive" role="alert" aria-live="assertive">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>Błąd wysyłania</AlertTitle>
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Imię i nazwisko</FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="np. Jan Kowalski"
            autoComplete="name"
            disabled={isPending}
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
          />
          {fieldErrors.name && <FieldError id="name-error">{fieldErrors.name}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Adres e-mail</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="np. jan@firma.pl"
            autoComplete="email"
            disabled={isPending}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
          />
          {fieldErrors.email && <FieldError id="email-error">{fieldErrors.email}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="subject">Temat</FieldLabel>
          <Input
            id="subject"
            name="subject"
            type="text"
            placeholder="np. Pytanie o wdrożenie"
            disabled={isPending}
            aria-invalid={!!fieldErrors.subject}
            aria-describedby={fieldErrors.subject ? "subject-error" : undefined}
          />
          {fieldErrors.subject && <FieldError id="subject-error">{fieldErrors.subject}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="message">Wiadomość</FieldLabel>
          <Textarea
            id="message"
            name="message"
            placeholder="Opisz swoje pytanie lub problem..."
            rows={5}
            disabled={isPending}
            aria-invalid={!!fieldErrors.message}
            aria-describedby={fieldErrors.message ? "message-error" : undefined}
          />
          {fieldErrors.message && <FieldError id="message-error">{fieldErrors.message}</FieldError>}
        </Field>
      </FieldGroup>

      <Button type="submit" fullWidth loading={isPending} loadingPosition="start" disabled={isPending}>
        {isPending ? "Wysyłanie..." : "Wyślij wiadomość"}
      </Button>
    </form>
  );
}

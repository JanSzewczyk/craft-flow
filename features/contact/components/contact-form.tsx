"use client";

import * as React from "react";
import { useTransition } from "react";

import { CheckCircle2, TriangleAlert } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
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
  Select,
  SelectContent,
  SelectItem,
  Textarea
} from "@szum-tech/design-system";
import { contactFormSchema, type ContactFormData } from "~/features/contact/schemas/contact-schema";
import { sendContactEmail } from "~/features/contact/server/actions/send-contact-email";

export function ContactForm() {
  const [result, setResult] = React.useState<{ success: true } | { success: false; error: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "other",
      message: ""
    }
  });

  function onSubmit(data: ContactFormData) {
    startTransition(() => {
      void sendContactEmail(data).then(setResult);
    });
  }

  function handleReset() {
    setResult(null);
    form.reset();
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
            Dziękujemy za wiadomość. Odezwiemy się w ciągu 24 godzin.
          </p>
        </div>
        <Button variant="outline" onClick={handleReset}>
          Wyślij kolejną wiadomość
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {result && !result.success && (
        <Alert variant="destructive" role="alert" aria-live="assertive">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>Błąd wysyłania</AlertTitle>
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.name}>
          <FieldLabel htmlFor="name">Imię i nazwisko</FieldLabel>
          <Input
            id="name"
            placeholder="np. Jan Kowalski"
            autoComplete="name"
            disabled={isPending}
            aria-invalid={!!form.formState.errors.name}
            aria-describedby={form.formState.errors.name ? "name-error" : undefined}
            {...form.register("name")}
          />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.email}>
          <FieldLabel htmlFor="email">Adres e-mail</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="np. jan@firma.pl"
            autoComplete="email"
            disabled={isPending}
            aria-invalid={!!form.formState.errors.email}
            aria-describedby={form.formState.errors.email ? "email-error" : undefined}
            {...form.register("email")}
          />
          <FieldError errors={[form.formState.errors.email]} />
        </Field>

        <Controller
          control={form.control}
          name="subject"
          render={({ field: { onChange, ...fieldProps }, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="subject">Temat</FieldLabel>
              <Select
                placeholder="Wybierz temat"
                invalid={fieldState.invalid}
                aria-describedby={fieldState.invalid ? "subject-error" : undefined}
                onValueChange={onChange}
                {...fieldProps}
              >
                <SelectContent>
                  <SelectItem value="demo">Prezentacja systemu (Demo)</SelectItem>
                  <SelectItem value="pricing">Zapytanie o cennik</SelectItem>
                  <SelectItem value="support">Pomoc techniczna</SelectItem>
                  <SelectItem value="other">Inne</SelectItem>
                </SelectContent>
              </Select>

              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Field data-invalid={!!form.formState.errors.message}>
          <FieldLabel htmlFor="message">Wiadomość</FieldLabel>
          <Textarea
            id="message"
            placeholder="Opisz swoje pytanie lub problem..."
            rows={5}
            disabled={isPending}
            aria-invalid={!!form.formState.errors.message}
            aria-describedby={form.formState.errors.message ? "message-error" : undefined}
            {...form.register("message")}
          />
          <FieldError errors={[form.formState.errors.message]} />
        </Field>
      </FieldGroup>

      <Button type="submit" fullWidth loading={isPending}>
        {isPending ? "Wysyłanie..." : "Wyślij wiadomość"}
      </Button>
    </form>
  );
}

"use client";

import * as React from "react";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  Textarea,
  toast
} from "@szum-tech/design-system";
import { contactFormSchema, type ContactFormData } from "~/features/contact/schemas/contact-schema";
import { type ActionResponse } from "~/lib/action-types";

type ContactFormProps = {
  onSubmitAction: (data: ContactFormData) => ActionResponse;
};

export function ContactForm({ onSubmitAction }: ContactFormProps) {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "other",
      message: ""
    }
  });

  async function handleSubmit(data: ContactFormData) {
    const result = await onSubmitAction(data);
    if (result.success) {
      toast.success("Wiadomość wysłana!", {
        description: "Dziękujemy za wiadomość. Odezwiemy się w ciągu 24 godzin."
      });
      form.reset();
    } else {
      toast.error("Błąd wysyłania", {
        description: result.error || "Nie udało się wysłać wiadomości"
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-6">
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.name}>
          <FieldLabel htmlFor="name">Imię i nazwisko</FieldLabel>
          <Input
            id="name"
            placeholder="np. Jan Kowalski"
            autoComplete="name"
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
            aria-invalid={!!form.formState.errors.message}
            aria-describedby={form.formState.errors.message ? "message-error" : undefined}
            {...form.register("message")}
          />
          <FieldError errors={[form.formState.errors.message]} />
        </Field>
      </FieldGroup>

      <Button type="submit" fullWidth loading={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
      </Button>
    </form>
  );
}

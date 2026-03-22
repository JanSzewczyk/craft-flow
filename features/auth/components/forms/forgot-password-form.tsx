"use client";

import * as React from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field, FieldError, FieldGroup, FieldLabel, Input, toast } from "@szum-tech/design-system";
import Link from "next/link";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "~/features/auth/schemas/forgot-password-schema";

type ForgotPasswordFormProps = {
  onSubmit: (data: ForgotPasswordFormData) => Promise<{ error?: string }>;
};

export function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  async function handleSubmit(data: ForgotPasswordFormData) {
    const result = await onSubmit(data);
    if (result.error) {
      toast.error("Błąd", { description: result.error });
    }
  }

  return (
    <div className="bg-card border-border flex w-full flex-col gap-6 rounded-2xl border p-8 shadow-sm">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-card-foreground text-2xl font-bold tracking-tight">Resetuj hasło</h1>
        <p className="text-muted-foreground text-sm">
          Podaj swój adres e-mail, a wyślemy Ci kod do zresetowania hasła.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-4">
        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.email}>
            <FieldLabel htmlFor="email">Adres e-mail</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="imie@firma.pl"
              autoComplete="email"
              aria-invalid={!!form.formState.errors.email}
              aria-describedby={form.formState.errors.email ? "email-error" : undefined}
              {...form.register("email")}
            />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>
        </FieldGroup>

        <Button type="submit" fullWidth loading={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Wysyłanie..." : "Wyślij kod resetowania"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Pamiętasz hasło?</span>
        <Link href="/sign-in" className="text-primary ml-1 font-medium hover:underline">
          Zaloguj się
        </Link>
      </div>
    </div>
  );
}

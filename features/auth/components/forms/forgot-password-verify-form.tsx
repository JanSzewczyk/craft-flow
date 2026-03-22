"use client";

import * as React from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field, FieldError, FieldGroup, FieldLabel, Input, toast } from "@szum-tech/design-system";
import {
  forgotPasswordVerifySchema,
  type ForgotPasswordVerifyFormData
} from "~/features/auth/schemas/forgot-password-schema";

type ForgotPasswordVerifyFormProps = {
  onSubmit: (data: ForgotPasswordVerifyFormData) => Promise<{ error?: string }>;
};

export function ForgotPasswordVerifyForm({ onSubmit }: ForgotPasswordVerifyFormProps) {
  const form = useForm<ForgotPasswordVerifyFormData>({
    resolver: zodResolver(forgotPasswordVerifySchema),
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: ""
    }
  });

  async function handleSubmit(data: ForgotPasswordVerifyFormData) {
    const result = await onSubmit(data);
    if (result.error) {
      toast.error("Błąd resetowania hasła", { description: result.error });
    }
  }

  return (
    <div className="bg-card border-border flex w-full flex-col gap-6 rounded-2xl border p-8 shadow-sm">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-card-foreground text-2xl font-bold tracking-tight">Ustaw nowe hasło</h1>
        <p className="text-muted-foreground text-sm">Wprowadź kod z e-maila i ustaw nowe hasło.</p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-4">
        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.code}>
            <FieldLabel htmlFor="code">Kod weryfikacyjny</FieldLabel>
            <Input
              id="code"
              placeholder="123456"
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              aria-invalid={!!form.formState.errors.code}
              aria-describedby={form.formState.errors.code ? "code-error" : undefined}
              {...form.register("code")}
            />
            <FieldError errors={[form.formState.errors.code]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.password}>
            <FieldLabel htmlFor="password">Nowe hasło</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!!form.formState.errors.password}
              aria-describedby={form.formState.errors.password ? "password-error" : undefined}
              {...form.register("password")}
            />
            <FieldError errors={[form.formState.errors.password]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword">Potwierdź nowe hasło</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!!form.formState.errors.confirmPassword}
              aria-describedby={form.formState.errors.confirmPassword ? "confirmPassword-error" : undefined}
              {...form.register("confirmPassword")}
            />
            <FieldError errors={[form.formState.errors.confirmPassword]} />
          </Field>
        </FieldGroup>

        <Button type="submit" fullWidth loading={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Resetowanie..." : "Resetuj hasło"}
        </Button>
      </form>
    </div>
  );
}

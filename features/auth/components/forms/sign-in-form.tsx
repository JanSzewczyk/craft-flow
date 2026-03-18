import * as React from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field, FieldError, FieldGroup, FieldLabel, Input, Separator, toast } from "@szum-tech/design-system";
import Link from "next/link";
import { GoogleButton } from "~/features/auth/components/google-button";
import { signInSchema, type SignInFormData } from "~/features/auth/schemas/sign-in-schema";

type SignInFormProps = {
  onEmailSignIn: (data: SignInFormData) => Promise<{ error?: string }>;
  onGoogleSignIn: () => void;
};

export function SignInForm({ onEmailSignIn, onGoogleSignIn }: SignInFormProps) {
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function handleSubmit(data: SignInFormData) {
    const result = await onEmailSignIn(data);
    if (result.error) {
      toast.error("Błąd logowania", { description: result.error });
    }
  }

  return (
    <div className="space-y-8">
      <GoogleButton onClick={onGoogleSignIn}>Kontynuuj przez Google</GoogleButton>

      <div className="relative">
        <Separator orientation="horizontal" />
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="bg-card text-mute px-2 uppercase">lub</span>
        </div>
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

          <Field data-invalid={!!form.formState.errors.password}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Hasło</FieldLabel>
              <Link href="/forgot-password" className="text-primary text-xs hover:underline">
                Zapomniałeś?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              aria-invalid={!!form.formState.errors.password}
              aria-describedby={form.formState.errors.password ? "password-error" : undefined}
              {...form.register("password")}
            />
            <FieldError errors={[form.formState.errors.password]} />
          </Field>
        </FieldGroup>

        <Button type="submit" fullWidth loading={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Logowanie..." : "Zaloguj się"}
        </Button>
      </form>
    </div>
  );
}

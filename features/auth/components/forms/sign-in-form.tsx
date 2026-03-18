import * as React from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Separator,
  toast
} from "@szum-tech/design-system";
import Link from "next/link";
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
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-card-foreground text-2xl font-bold tracking-tight">Witaj ponownie</h1>
          <p className="text-muted-foreground text-sm">Zaloguj się do swojego panelu rzemieślnika.</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <Button type="button" onClick={onGoogleSignIn} variant="outline" fullWidth>
          <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Kontynuuj przez Google
        </Button>

        <div className="relative">
          <Separator orientation="horizontal" />
          <div className="relative flex -translate-y-1/2 justify-center">
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
      </CardContent>

      {/*<div className="text-center text-sm">*/}
      {/*  <span className="text-muted-foreground">Nie masz konta?</span>*/}
      {/*  <Link href="/sign-up" className="text-primary ml-1 font-medium hover:underline">*/}
      {/*    Utwórz konto*/}
      {/*  </Link>*/}
      {/*</div>*/}
    </Card>
  );
}

import * as React from "react";

import { ZapIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field, FieldError, FieldGroup, FieldLabel, Input, Separator, toast } from "@szum-tech/design-system";
import { GoogleButton } from "~/features/auth/components/google-button";
import { signUpSchema, type SignUpFormData } from "~/features/auth/schemas/sign-up-schema";

type SignUpFormProps = {
  onEmailSignUp: (data: SignUpFormData) => Promise<{ error?: string }>;
  onGoogleSignUp: () => void;
};

export function SignUpForm({ onEmailSignUp, onGoogleSignUp }: SignUpFormProps) {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  async function handleSubmit(data: SignUpFormData) {
    const result = await onEmailSignUp(data);
    if (result.error) {
      toast.error("Błąd rejestracji", { description: result.error });
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-5">
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={!!form.formState.errors.firstName}>
              <FieldLabel htmlFor="firstName">Imię</FieldLabel>
              <Input
                id="firstName"
                type="text"
                placeholder="Jan"
                autoComplete="given-name"
                aria-invalid={!!form.formState.errors.firstName}
                aria-describedby={form.formState.errors.firstName ? "firstName-error" : undefined}
                {...form.register("firstName")}
              />
              <FieldError errors={[form.formState.errors.firstName]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.lastName}>
              <FieldLabel htmlFor="lastName">Nazwisko</FieldLabel>
              <Input
                id="lastName"
                type="text"
                placeholder="Kowalski"
                autoComplete="family-name"
                aria-invalid={!!form.formState.errors.lastName}
                aria-describedby={form.formState.errors.lastName ? "lastName-error" : undefined}
                {...form.register("lastName")}
              />
              <FieldError errors={[form.formState.errors.lastName]} />
            </Field>
          </div>

          <Field data-invalid={!!form.formState.errors.email}>
            <FieldLabel htmlFor="email">E-mail firmowy</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="nazwa@firma.pl"
              autoComplete="email"
              aria-invalid={!!form.formState.errors.email}
              aria-describedby={form.formState.errors.email ? "email-error" : undefined}
              {...form.register("email")}
            />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.password}>
            <FieldLabel htmlFor="password">Hasło</FieldLabel>
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
            <FieldLabel htmlFor="confirmPassword">Potwierdź hasło</FieldLabel>
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
          {form.formState.isSubmitting ? "Rejestracja..." : "Zacznij darmowy trial"}
          {!form.formState.isSubmitting && <ZapIcon className="size-5" />}
        </Button>
      </form>

      <div className="relative">
        <Separator orientation="horizontal" />
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="bg-card text-muted-foreground px-2 text-xs uppercase">lub</span>
        </div>
      </div>

      <GoogleButton onClick={onGoogleSignUp}>Zarejestruj się przez Google</GoogleButton>
    </div>
  );
}

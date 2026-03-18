import * as React from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Field, FieldError, FieldGroup, FieldLabel, Input, toast } from "@szum-tech/design-system";
import {
  emailVerificationSchema,
  type EmailVerificationFormData
} from "~/features/auth/schemas/email-verification-schema";

type EmailVerificationFormProps = {
  onVerify: (data: EmailVerificationFormData) => Promise<{ error?: string }>;
  onResend: () => Promise<{ error?: string }>;
  onReset?: () => void;
};

export function EmailVerificationForm({ onVerify, onResend, onReset }: EmailVerificationFormProps) {
  const form = useForm<EmailVerificationFormData>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      code: ""
    }
  });

  const [isResending, setIsResending] = React.useState(false);

  async function handleSubmit(data: EmailVerificationFormData) {
    const result = await onVerify(data);
    if (result.error) {
      toast.error("Błąd weryfikacji", { description: result.error });
    }
  }

  async function handleResend() {
    setIsResending(true);
    const result = await onResend();
    setIsResending(false);
    if (result.error) {
      toast.error("Błąd", { description: result.error });
    } else {
      toast.success("Kod wysłany ponownie", {
        description: "Sprawdź swoją skrzynkę e-mail."
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
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
              className="text-center"
              {...form.register("code")}
            />
            <FieldError errors={[form.formState.errors.code]} />
          </Field>
        </FieldGroup>

        <Button type="submit" fullWidth loading={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Weryfikacja..." : "Zweryfikuj e-mail"}
        </Button>
      </form>

      <div className="flex flex-col items-center gap-2 text-center">
        <div className="text-body-sm">
          <span className="text-muted-foreground">Nie otrzymałeś kodu?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-primary ml-1 font-medium hover:underline disabled:opacity-50"
          >
            {isResending ? "Wysyłanie..." : "Wyślij ponownie"}
          </button>
        </div>

        {onReset && (
          <Button
            type="button"
            variant="link"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground font-medium hover:underline"
          >
            Wróć do logowania
          </Button>
        )}
      </div>
    </div>
  );
}

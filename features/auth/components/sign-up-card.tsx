"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { useSignUp } from "@clerk/nextjs";
import { Card, CardContent, CardHeader } from "@szum-tech/design-system";
import { EmailVerificationForm } from "~/features/auth/components/forms/email-verification-form";
import { SignUpForm } from "~/features/auth/components/forms/sign-up-form";
import { type EmailVerificationFormData } from "~/features/auth/schemas/email-verification-schema";
import { type SignUpFormData } from "~/features/auth/schemas/sign-up-schema";

export function SignUpCard() {
  const { signUp } = useSignUp();
  const router = useRouter();
  const [step, setStep] = React.useState<"credentials" | "verification">("credentials");
  const [email, setEmail] = React.useState<string>("");

  async function handleEmailSignUp(data: SignUpFormData): Promise<{ error?: string }> {
    if (!signUp) return { error: "Usługa rejestracji jest niedostępna. Spróbuj ponownie." };

    const { error } = await signUp.password({
      emailAddress: data.email,
      password: data.password
    });

    if (error) return { error: error.message };

    const { error: codeError } = await signUp.verifications.sendEmailCode();
    if (codeError) return { error: codeError.message };

    setEmail(data.email);
    setStep("verification");
    return {};
  }

  async function handleVerify(data: EmailVerificationFormData): Promise<{ error?: string }> {
    if (!signUp) return { error: "Usługa weryfikacji jest niedostępna. Spróbuj ponownie." };

    const { error } = await signUp.verifications.verifyEmailCode({ code: data.code });
    if (error) return { error: error.message };

    if (signUp.status === "complete") {
      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) return { error: finalizeError.message };
      router.push("/");
      return {};
    }

    return { error: "Rejestracja nie powiodła się. Spróbuj ponownie." };
  }

  async function handleResend(): Promise<{ error?: string }> {
    if (!signUp) return { error: "Usługa jest niedostępna. Spróbuj ponownie." };

    const { error } = await signUp.verifications.sendEmailCode();
    if (error) return { error: error.message };
    return {};
  }

  function handleGoogleSignUp() {
    if (!signUp) return;
    void signUp.sso({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectCallbackUrl: "/"
    });
  }

  if (step === "verification") {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-card-foreground text-2xl font-bold tracking-tight">Zweryfikuj e-mail</h1>
            <p className="text-muted-foreground text-sm">
              Wysłaliśmy 6-cyfrowy kod na <span className="text-foreground font-medium">{email}</span>.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <EmailVerificationForm onVerify={handleVerify} onResend={handleResend} />
        </CardContent>
      </Card>
    );
  }

  return <SignUpForm onEmailSignUp={handleEmailSignUp} onGoogleSignUp={handleGoogleSignUp} />;
}

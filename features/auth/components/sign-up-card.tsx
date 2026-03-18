"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { useSignUp } from "@clerk/nextjs";
import { EmailVerificationForm } from "~/features/auth/components/forms/email-verification-form";
import { type SignUpFormData } from "~/features/auth/schemas/sign-up-schema";
import { type EmailVerificationFormData } from "~/features/auth/schemas/email-verification-schema";
import { SignUpForm } from "~/features/auth/components/forms/sign-up-form";

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
    return <EmailVerificationForm onVerify={handleVerify} onResend={handleResend} email={email} />;
  }

  return <SignUpForm onEmailSignUp={handleEmailSignUp} onGoogleSignUp={handleGoogleSignUp} />;
}

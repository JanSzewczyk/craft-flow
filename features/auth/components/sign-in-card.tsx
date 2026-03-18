"use client";

import * as React from "react";

import { useSignIn } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@szum-tech/design-system";
import { useRouter } from "next/navigation";
import { EmailVerificationForm } from "~/features/auth/components/forms/email-verification-form";
import { SignInForm } from "~/features/auth/components/forms/sign-in-form";
import { type EmailVerificationFormData } from "~/features/auth/schemas/email-verification-schema";
import { type SignInFormData } from "~/features/auth/schemas/sign-in-schema";

export function SignInCard() {
  const { signIn } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = React.useState("");

  async function handleEmailSignIn(data: SignInFormData): Promise<{ error?: string }> {
    const { error } = await signIn.password({
      identifier: data.email,
      password: data.password
    });
    if (error) return { error: error.message };

    if (signIn.status === "complete") {
      const { error: finalizeError } = await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            return;
          }

          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url);
          }
        }
      });
      if (finalizeError) return { error: finalizeError.message };
      return {};
    } else if (signIn.status === "needs_second_factor") {
      // See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
      return {};
    } else if (signIn.status === "needs_client_trust") {
      // For other second factor strategies,
      // see https://clerk.com/docs/guides/development/custom-flows/authentication/client-trust
      const emailCodeFactor = signIn.supportedSecondFactors.find((factor) => factor.strategy === "email_code");

      if (emailCodeFactor) {
        const { error: codeError } = await signIn.mfa.sendEmailCode();
        if (codeError) return { error: codeError.message };
      }

      setEmail(data.email);
      return {};
    }

    return { error: "Logowanie nie powiodło się. Spróbuj ponownie." };
  }

  function handleGoogleSignIn() {
    void signIn.sso({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectCallbackUrl: "/"
    });
  }

  async function handleVerify({ code }: EmailVerificationFormData): Promise<{ error?: string }> {
    const { error } = await signIn.mfa.verifyEmailCode({ code });
    if (error) return { error: error.message };

    if (signIn.status === "complete") {
      const { error: finalizeError } = await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            return;
          }

          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url);
          }
        }
      });
      if (finalizeError) return { error: finalizeError.message };
      return {};
    }

    return { error: "Logowanie nie powiodło się. Spróbuj ponownie." };
  }

  async function handleResend(): Promise<{ error?: string }> {
    const { error } = await signIn.mfa.sendEmailCode();
    if (error) return { error: error.message };
    return {};
  }

  function handleReset() {
    void signIn.reset();
    setEmail("");
  }

  if (signIn?.status === "needs_client_trust") {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-heading-h2">Zweryfikuj e-mail</CardTitle>
          <CardDescription>
            Wysłaliśmy 6-cyfrowy kod na <span className="text-foreground font-medium">{email}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmailVerificationForm onVerify={handleVerify} onResend={handleResend} onReset={handleReset} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-heading-h2">Witaj ponownie</CardTitle>
        <CardDescription>Zaloguj się do swojego panelu rzemieślnika.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm onEmailSignIn={handleEmailSignIn} onGoogleSignIn={handleGoogleSignIn} />
      </CardContent>
    </Card>
  );
}

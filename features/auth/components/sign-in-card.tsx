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

  // const [step, setStep] = React.useState<"credentials" | "verification">("credentials");
  // const [email, setEmail] = React.useState<string>("");

  async function handleEmailSignIn(data: SignInFormData): Promise<{ error?: string }> {
    if (!signIn) return { error: "Usługa logowania jest niedostępna. Spróbuj ponownie." };

    const { error } = await signIn.password({
      emailAddress: data.email,
      password: data.password
    });

    if (error) return { error: error.message };

    if (signIn.status === "complete") {
      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) return { error: finalizeError.message };
      router.push("/");
      return {};
    }

    if (signIn.status === "needs_first_factor") {
      const { error: codeError } = await signIn.emailCode.sendCode();
      if (codeError) return { error: codeError.message };
      // setEmail(data.email);
      // setStep("verification");
      return {};
    }

    return { error: "Logowanie nie powiodło się. Spróbuj ponownie." };
  }

  function handleGoogleSignIn() {
    if (!signIn) return;
    void signIn.sso({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectCallbackUrl: "/"
    });
  }

  async function handleVerify(data: EmailVerificationFormData): Promise<{ error?: string }> {
    if (!signIn) return { error: "Usługa weryfikacji jest niedostępna. Spróbuj ponownie." };

    const { error } = await signIn.emailCode.verifyCode(data);
    if (error) return { error: error.message };

    if (signIn.status === "complete") {
      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) return { error: finalizeError.message };
      router.push("/");
      return {};
    }
    return { error: "Logowanie nie powiodło się. Spróbuj ponownie." };
  }

  async function handleResend(): Promise<{ error?: string }> {
    if (!signIn) return { error: "Usługa jest niedostępna. Spróbuj ponownie." };
    const { error } = await signIn.emailCode.sendCode();
    if (error) return { error: error.message };
    return {};
  }

  if (signIn.status === "needs_client_trust") {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-heading-h2">Zweryfikuj e-mail</CardTitle>
          {/* TODO add email */}
          <CardDescription>
            Wysłaliśmy 6-cyfrowy kod na <span className="text-foreground font-medium">{"EMAIL"}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmailVerificationForm onVerify={handleVerify} onResend={handleResend} />
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

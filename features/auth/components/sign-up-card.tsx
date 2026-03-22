"use client";

import * as React from "react";

import { AwardIcon, ShieldCheckIcon, ShieldIcon } from "lucide-react";

import { useAuth, useSignUp } from "@clerk/nextjs";
import { Alert, AlertTitle, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@szum-tech/design-system";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmailVerificationForm } from "~/features/auth/components/forms/email-verification-form";
import { SignUpForm } from "~/features/auth/components/forms/sign-up-form";
import { type EmailVerificationFormData } from "~/features/auth/schemas/email-verification-schema";
import { type SignUpFormData } from "~/features/auth/schemas/sign-up-schema";
import { type ActionResponse } from "~/lib/action-types";

type SignUpCardProps = {
  onCompleteSignUpAction(userIs: string): ActionResponse<true>;
};

export function SignUpCard({ onCompleteSignUpAction }: SignUpCardProps) {
  const { signUp } = useSignUp();
  const { getToken } = useAuth();
  const router = useRouter();
  const [step, setStep] = React.useState<"credentials" | "verification">("credentials");
  const [email, setEmail] = React.useState<string>("");

  async function handleEmailSignUp(data: SignUpFormData): Promise<{ error?: string }> {
    const { error } = await signUp.password({
      emailAddress: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName
    });

    if (error) return { error: error.message };

    const { error: codeError } = await signUp.verifications.sendEmailCode();
    if (codeError) return { error: codeError.message };

    setEmail(data.email);
    setStep("verification");
    return {};
  }

  async function handleVerify(data: EmailVerificationFormData): Promise<{ error?: string }> {
    const { error } = await signUp.verifications.verifyEmailCode({ code: data.code });
    if (error) return { error: error.message };

    if (signUp.status === "complete") {
      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) return { error: finalizeError.message };

      if (signUp.createdUserId) {
        await onCompleteSignUpAction(signUp.createdUserId);
        await getToken({ skipCache: true });
      }

      router.push("/onboarding");
      return {};
    }

    return { error: "Rejestracja nie powiodła się. Spróbuj ponownie." };
  }

  async function handleResend(): Promise<{ error?: string }> {
    const { error } = await signUp.verifications.sendEmailCode();
    if (error) return { error: error.message };
    return {};
  }

  function handleGoogleSignUp() {
    void signUp.sso({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectCallbackUrl: ""
    });
  }

  if (step === "verification") {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-heading-h2">Zweryfikuj e-mail</CardTitle>
          <CardDescription>
            Wysłaliśmy 6-cyfrowy kod na <span className="text-foreground font-medium">{email}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmailVerificationForm onVerify={handleVerify} onResend={handleResend} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Alert variant="default">
        <AwardIcon />
        <AlertTitle>14 dni Basic za darmo (bez karty płatniczej)</AlertTitle>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-heading-h2">Zacznij budować swój sukces</CardTitle>
          <CardDescription>
            Dołącz do grona profesjonalistów i stwórz swój portal w kilka chwil.
            <span className="mt-2 block">
              Chcesz pominąć okres próbny?{" "}
              <Link href="/pricing" className="text-primary font-medium hover:underline">
                Wybierz plan i zarejestruj się teraz
              </Link>
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm onEmailSignUp={handleEmailSignUp} onGoogleSignUp={handleGoogleSignUp} />

          <div className="text-body-sm mt-8 text-center">
            <span className="text-muted-foreground">Masz już konto?</span>
            <Link href="/sign-in" className="text-primary ml-1 hover:underline">
              Zaloguj się
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground flex justify-center gap-8 px-4 opacity-60 transition-all duration-500 hover:opacity-100">
        <div className="flex items-center gap-2">
          <ShieldIcon className="size-4" />
          <span className="text-body-sm">Bezpieczne połączenie</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="size-4" />
          <span className="text-body-sm">Zgodność z RODO</span>
        </div>
      </div>
    </div>
  );
}

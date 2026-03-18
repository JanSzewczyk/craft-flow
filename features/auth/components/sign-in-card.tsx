"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SignInForm } from "~/features/auth/components/forms/sign-in-form";
import { type SignInFormData } from "~/features/auth/schemas/sign-in-schema";

export function SignInCard() {
  const { signIn } = useSignIn();
  const router = useRouter();

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

  return <SignInForm onEmailSignIn={handleEmailSignIn} onGoogleSignIn={handleGoogleSignIn} />;
}

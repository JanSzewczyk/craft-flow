"use client";

import { useRouter } from "next/navigation";

import { useSignIn } from "@clerk/nextjs";

import { type ForgotPasswordVerifyFormData } from "~/features/auth/schemas/forgot-password-schema";
import { ForgotPasswordVerifyForm } from "~/features/auth/components/forms/forgot-password-verify-form";

export function ForgotPasswordVerifyCard() {
  const { signIn } = useSignIn();
  const router = useRouter();

  async function handleSubmit(data: ForgotPasswordVerifyFormData): Promise<{ error?: string }> {
    if (!signIn) return { error: "Usługa jest niedostępna. Spróbuj ponownie." };

    const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code: data.code });
    if (error) return { error: error.message };

    const { error: pwError } = await signIn.resetPasswordEmailCode.submitPassword({
      password: data.password
    });
    if (pwError) return { error: pwError.message };

    if (signIn.status === "complete") {
      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) return { error: finalizeError.message };
      router.push("/");
      return {};
    }

    return { error: "Resetowanie hasła nie powiodło się. Spróbuj ponownie." };
  }

  return <ForgotPasswordVerifyForm onSubmit={handleSubmit} />;
}

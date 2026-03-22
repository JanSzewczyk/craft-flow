"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ForgotPasswordForm } from "~/features/auth/components/forms/forgot-password-form";
import { type ForgotPasswordFormData } from "~/features/auth/schemas/forgot-password-schema";

export function ForgotPasswordCard() {
  const { signIn } = useSignIn();
  const router = useRouter();

  async function handleSubmit(data: ForgotPasswordFormData): Promise<{ error?: string }> {
    if (!signIn) return { error: "Usługa jest niedostępna. Spróbuj ponownie." };

    const { error } = await signIn.create({ identifier: data.email });
    if (error) return { error: error.message };

    const { error: codeError } = await signIn.resetPasswordEmailCode.sendCode();
    if (codeError) return { error: codeError.message };

    router.push("/forgot-password/verify");
    return {};
  }

  return <ForgotPasswordForm onSubmit={handleSubmit} />;
}

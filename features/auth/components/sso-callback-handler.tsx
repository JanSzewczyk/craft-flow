"use client";

import { useSignUp } from "@clerk/nextjs";
import { HandleSSOCallback } from "@clerk/react";
import { toast } from "@szum-tech/design-system";
import { useRouter } from "next/navigation";
import { type ActionResponse } from "~/lib/action-types";

type SSOCallbackHandlerProps = {
  onCompleteSignUpAction(userId: string): ActionResponse<true>;
};

export function SSOCallbackHandler({ onCompleteSignUpAction }: SSOCallbackHandlerProps) {
  const { signUp } = useSignUp();
  const router = useRouter();

  return (
    <HandleSSOCallback
      navigateToApp={async () => {
        if (signUp?.createdUserId) {
          const result = await onCompleteSignUpAction(signUp.createdUserId);
          if (!result.success) {
            toast.error("Failed to set metadata after SSO sign-up:");
          }
        }
        router.push("/");
      }}
      navigateToSignIn={() => {
        router.push("/sign-in");
      }}
      navigateToSignUp={() => {
        router.push("/sign-up");
      }}
    />
  );
}

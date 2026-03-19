"use server";

import { z } from "zod";

import { Role } from "~/features/auth/constants/roles";
import { type ActionResponse } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

import { setUserMetadata } from "../api/set-user-metadata";

const logger = createLogger({ module: "complete-sign-up-action" });

const completeSignUpSchema = z.object({
  userId: z.string().min(1, "User ID is required")
});

export async function completeSignUp(userId: string): ActionResponse<true> {
  const result = completeSignUpSchema.safeParse({ userId });

  if (!result.success) {
    return {
      success: false,
      error: "Invalid user ID provided."
    };
  }

  const [error] = await setUserMetadata(result.data.userId, {
    roles: [Role.CONTRACTOR],
    onboardingComplete: false
  });

  if (error) {
    logger.error({ userId: result.data.userId, errorCode: error.code }, "Failed to complete sign-up");
    return {
      success: false,
      error: "Nie udało się dokończyć rejestracji. Spróbuj ponownie później."
    };
  }

  return { success: true, data: true };
}

"use server";

import { z } from "zod";

import { clerkClient } from "@clerk/nextjs/server";
import { Role } from "~/features/auth/constants/roles";
import { linkClientsByEmail, updateClient } from "~/features/crm/server/db/mutations";
import { getProjectByPublicToken } from "~/features/projects/server/db/queries";
import { type ActionResponse } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

import { setUserMetadata } from "../api/set-user-metadata";

const logger = createLogger({ module: "complete-client-sign-up-action" });

const completeClientSignUpSchema = z.object({
  inviteToken: z.string().min(1).nullable(),
  userId: z.string().min(1, "User ID is required")
});

export async function completeClientSignUp({
  inviteToken,
  userId
}: {
  inviteToken: string | null;
  userId: string;
}): ActionResponse<true> {
  const result = completeClientSignUpSchema.safeParse({ inviteToken, userId });

  if (!result.success) {
    return { success: false, error: "Nieprawidłowy identyfikator użytkownika." };
  }

  const client = await clerkClient();
  const user = await client.users.getUser(result.data.userId);
  const primaryEmail = user.primaryEmailAddress?.emailAddress;

  if (!primaryEmail) {
    logger.error({ userId: result.data.userId }, "No primary email found for user");
    return { success: false, error: "Nie udało się dokończyć rejestracji. Brak adresu e-mail." };
  }

  const [metadataError] = await setUserMetadata(result.data.userId, {
    roles: [Role.CLIENT]
  });

  if (metadataError) {
    logger.error({ userId: result.data.userId, errorCode: metadataError.code }, "Failed to set CLIENT role");
    return { success: false, error: "Nie udało się dokończyć rejestracji. Spróbuj ponownie później." };
  }

  if (result.data.inviteToken) {
    const [projectErr, project] = await getProjectByPublicToken({ token: result.data.inviteToken });

    if (projectErr) {
      logger.warn(
        { userId: result.data.userId, inviteToken: result.data.inviteToken, errorCode: projectErr.code },
        "Failed to resolve inviteToken to project — falling back to email-only linking"
      );
    } else {
      const [updateError] = await updateClient({
        id: project.clientId,
        data: { clerkUserId: result.data.userId, email: primaryEmail }
      });

      if (updateError) {
        logger.warn(
          { userId: result.data.userId, clientId: project.clientId, errorCode: updateError.code },
          "Failed to link client by inviteToken — falling back to email-only linking"
        );
      }
    }
  }

  const [linkError] = await linkClientsByEmail({
    email: primaryEmail,
    clerkUserId: result.data.userId
  });

  if (linkError) {
    logger.error(
      { userId: result.data.userId, email: primaryEmail, errorCode: linkError.code },
      "Failed to link client records by email — account created but projects may not appear"
    );
  }

  return { success: true, data: true };
}

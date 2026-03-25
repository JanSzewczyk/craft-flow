"use server";

import { auth } from "@clerk/nextjs/server";
import { type ActionResponse } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";
import { deleteFile, getPathFromPublicUrl } from "~/lib/supabase/storage";

const logger = createLogger({ module: "onboarding-action" });

export async function deleteLogo(logoUrl: string): ActionResponse<void> {
  const { userId, isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const filePath = getPathFromPublicUrl(logoUrl, "logos");
  if (!filePath) {
    return { success: false, error: "Nieprawidłowy URL logo" };
  }

  const [error] = await deleteFile("logos", [filePath]);
  if (error) {
    logger.error({ userId, errorCode: error.code }, "Failed to delete logo");
    return { success: false, error: "Nie udało się usunąć logo" };
  }

  logger.info({ userId }, "Logo deleted successfully");
  return { success: true, data: undefined };
}

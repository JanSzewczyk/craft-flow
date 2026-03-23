"use server";

import { auth } from "@clerk/nextjs/server";
import { type ActionResponse } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";
import { deleteFile } from "~/lib/supabase/storage";

const logger = createLogger({ module: "onboarding-action" });

export async function deleteLogo(logoUrl: string): ActionResponse<void> {
  const { userId, isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  try {
    const url = new URL(logoUrl);
    const pathSegments = url.pathname.split("/logos/");
    const filePath = pathSegments[1];

    if (!filePath) {
      return { success: false, error: "Nieprawidłowy URL logo" };
    }

    await deleteFile("logos", [filePath]);
    logger.info({ userId }, "Logo deleted successfully");
    return { success: true, data: undefined };
  } catch (error) {
    logger.error({ userId, error }, "Failed to delete logo");
    return { success: false, error: "Nie udało się usunąć logo" };
  }
}

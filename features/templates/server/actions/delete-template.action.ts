"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { deleteTemplate } from "~/features/templates/server/services/templates.service";
import { type ActionResponse } from "~/lib/action-types";

import { logger } from "./logger";
import { mapTemplateServiceError } from "./map-service-error";

export async function deleteTemplateAction(id: string): ActionResponse<{ id: string }> {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.warn({ operation: "deleteTemplateAction" }, "Unauthenticated access attempt");
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const [error, result] = await deleteTemplate({ contractorId: userId, templateId: id });
  if (error) return mapTemplateServiceError(error);

  revalidatePath("/app/templates");
  return { success: true, data: result, message: "Szablon został usunięty" };
}

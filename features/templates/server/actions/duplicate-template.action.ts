"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { duplicateTemplate } from "~/features/templates/server/services/templates.service";
import { type ActionResponse } from "~/lib/action-types";

import { type Template } from "../db/schema";

import { logger } from "./logger";
import { mapTemplateServiceError } from "./map-service-error";

export async function duplicateTemplateAction(id: string): ActionResponse<Template> {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.warn({ operation: "duplicateTemplateAction" }, "Unauthenticated access attempt");
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const [error, template] = await duplicateTemplate({ contractorId: userId, templateId: id });
  if (error) return mapTemplateServiceError(error);

  revalidatePath("/app/templates");
  return { success: true, data: template, message: `Szablon "${template.name}" został utworzony` };
}

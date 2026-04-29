"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { type TemplateFormData } from "~/features/templates/schemas/template-schema";
import { createTemplate } from "~/features/templates/server/services/templates.service";
import { type ActionResponse } from "~/lib/action-types";

import { type Template } from "../db/schema";

import { logger } from "./logger";
import { mapTemplateServiceError } from "./map-service-error";

export async function createTemplateAction(data: TemplateFormData): ActionResponse<Template> {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.warn({ operation: "createTemplateAction" }, "Unauthenticated access attempt");
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const [error, template] = await createTemplate({ contractorId: userId, formData: data });
  if (error) return mapTemplateServiceError(error);

  revalidatePath("/app/templates");
  return { success: true, data: template, message: "Szablon został utworzony" };
}

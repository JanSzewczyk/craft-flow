"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { type EmailFormData } from "~/features/contractor/schemas/email-schema";
import { type EmailTemplate } from "~/features/contractor/server/db/email-templates/schema";
import { saveEmailTemplate } from "~/features/contractor/server/services/branding.service";
import { type ActionResponse } from "~/lib/action-types";

import { logger } from "./logger";
import { mapBrandingServiceError } from "./map-service-error";

export async function updateEmailTemplateAction(data: EmailFormData): ActionResponse<EmailTemplate> {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.warn({ operation: "updateEmailTemplateAction" }, "Unauthenticated access attempt");
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const [error, template] = await saveEmailTemplate(userId, data);
  if (error) return mapBrandingServiceError(error);

  revalidatePath("/app/email-notifications");
  return { success: true, data: template, message: "Szablon e-mail został zapisany" };
}

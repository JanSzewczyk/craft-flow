"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { getCachedContractorProfile } from "~/features/contractor/server/db";
import { duplicateTemplate } from "~/features/templates/server/db/mutations";
import { getTemplateWithSteps } from "~/features/templates/server/db/queries";
import { getTemplateLimits } from "~/features/templates/server/services/templates-list.service";
import { type ActionResponse } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";
import { type Template } from "../db/schema";

const logger = createLogger({ module: "template-actions" });

export async function duplicateTemplateAction(id: string): ActionResponse<Template> {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const [profileError, profile] = await getCachedContractorProfile(user.id);
  if (profileError || !profile) {
    return { success: false, error: "Nie znaleziono profilu wykonawcy" };
  }

  const [limitsError, limits] = await getTemplateLimits(user.id);
  if (limitsError) {
    logger.error({ userId: user.id, errorCode: limitsError.code }, "Failed to load template limits");
    return { success: false, error: "Nie udało się sprawdzić limitu szablonów" };
  }

  if (limits.used >= limits.max) {
    return {
      success: false,
      error: `Osiągnięto limit ${limits.max} szablonów. Zwiększ plan, aby dodać więcej.`
    };
  }

  const [fetchError, existing] = await getTemplateWithSteps(id);
  if (fetchError || !existing) {
    return { success: false, error: "Szablon nie istnieje" };
  }
  if (existing.template.contractorId !== profile.id) {
    logger.warn({ userId: user.id, templateId: id }, "Unauthorized template duplicate attempt");
    return { success: false, error: "Brak dostępu do tego szablonu" };
  }

  const newName = `[Kopia] ${existing.template.name}`;
  const [error, template] = await duplicateTemplate(id, newName);
  if (error || !template) {
    logger.error({ userId: user.id, templateId: id, errorCode: error?.code }, "Failed to duplicate template");
    return { success: false, error: "Nie udało się zduplikować szablonu" };
  }

  revalidatePath("/app/templates");
  return { success: true, data: template, message: `Szablon "${newName}" został utworzony` };
}

"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { getCachedContractorProfile } from "~/features/contractor/server/db";
import { deleteTemplate } from "~/features/templates/server/db/mutations";
import { getTemplateWithSteps } from "~/features/templates/server/db/queries";
import { type ActionResponse } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "template-actions" });

export async function deleteTemplateAction(id: string): ActionResponse<{ id: string }> {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const [profileError, profile] = await getCachedContractorProfile(user.id);
  if (profileError || !profile) {
    return { success: false, error: "Nie znaleziono profilu wykonawcy" };
  }

  const [fetchError, existing] = await getTemplateWithSteps(id);
  if (fetchError || !existing) {
    return { success: false, error: "Szablon nie istnieje" };
  }
  if (existing.template.contractorId !== profile.id) {
    logger.warn({ userId: user.id, templateId: id }, "Unauthorized template delete attempt");
    return { success: false, error: "Brak dostępu do tego szablonu" };
  }

  const [error] = await deleteTemplate(id);
  if (error) {
    logger.error({ userId: user.id, templateId: id, errorCode: error.code }, "Failed to delete template");
    return { success: false, error: "Nie udało się usunąć szablonu" };
  }

  revalidatePath("/app/templates");
  return { success: true, data: { id }, message: "Szablon został usunięty" };
}

"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getCachedContractorProfile } from "~/features/contractor/server/db";
import { type TemplateFormData } from "~/features/templates/schemas/template-schema";
import { replaceTemplateSteps, updateTemplate } from "~/features/templates/server/db/mutations";
import { getTemplateWithSteps } from "~/features/templates/server/db/queries";
import { type ActionResponse } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

import { type Template } from "../db/schema";

const logger = createLogger({ module: "template-actions" });

export async function updateTemplateAction(id: string, data: TemplateFormData): ActionResponse<Template> {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const [profileError, profile] = await getCachedContractorProfile(user.id);
  if (profileError || !profile) {
    return { success: false, error: "Nie znaleziono profilu wykonawcy" };
  }

  // Verify ownership
  const [fetchError, existing] = await getTemplateWithSteps(id);
  if (fetchError || !existing) {
    return { success: false, error: "Szablon nie istnieje" };
  }
  if (existing.template.contractorId !== profile.id) {
    logger.warn({ userId: user.id, templateId: id }, "Unauthorized template update attempt");
    return { success: false, error: "Brak dostępu do tego szablonu" };
  }

  const { name, description, steps } = data;

  const [updateError, updated] = await updateTemplate(id, { name, description });
  if (updateError || !updated) {
    logger.error({ userId: user.id, templateId: id, errorCode: updateError?.code }, "Failed to update template");
    return { success: false, error: "Nie udało się zaktualizować szablonu" };
  }

  const [stepsError] = await replaceTemplateSteps(
    id,
    steps.map((s, i) => ({ title: s.title, description: s.description, orderIndex: i }))
  );
  if (stepsError) {
    logger.error({ userId: user.id, templateId: id, errorCode: stepsError.code }, "Failed to replace template steps");
    return { success: false, error: "Nie udało się zaktualizować etapów szablonu" };
  }

  revalidatePath("/app/templates");
  return { success: true, data: updated, message: "Szablon został zapisany" };
}

"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getCachedContractorProfile } from "~/features/contractor/server/db";
import { type TemplateFormData } from "~/features/templates/schemas/template-schema";
import { createTemplateWithSteps } from "~/features/templates/server/db/mutations";
import { getTemplateLimits } from "~/features/templates/server/services/templates-list.service";
import { type ActionResponse } from "~/lib/action-types";
import { createLogger } from "~/lib/logger";

import { type Template } from "../db/schema";

const logger = createLogger({ module: "template-actions" });

export async function createTemplateAction(data: TemplateFormData): ActionResponse<Template> {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const [limitsError, limits] = await getTemplateLimits(user.id);
  if (limitsError) {
    logger.error({ userId: user.id, errorCode: limitsError.code }, "Failed to load template limits");
    return { success: false, error: "Nie udało się sprawdzić limitu szablonów" };
  }

  if (limits.max !== null && limits.used >= limits.max) {
    return {
      success: false,
      error: `Osiągnięto limit ${limits.max} szablonów. Zwiększ plan, aby dodać więcej.`
    };
  }

  const [profileError, profile] = await getCachedContractorProfile(user.id);
  if (profileError || !profile) {
    logger.error({ userId: user.id, errorCode: profileError?.code }, "Failed to load contractor profile");
    return { success: false, error: "Nie znaleziono profilu wykonawcy" };
  }

  const { name, description, steps } = data;
  const [error, template] = await createTemplateWithSteps(profile.id, {
    name,
    description,
    steps: steps.map((s, i) => ({ title: s.title, description: s.description, orderIndex: i }))
  });

  if (error || !template) {
    logger.error({ userId: user.id, errorCode: error?.code }, "Failed to create template");
    return { success: false, error: "Nie udało się utworzyć szablonu" };
  }

  revalidatePath("/app/templates");
  return { success: true, data: template, message: "Szablon został utworzony" };
}

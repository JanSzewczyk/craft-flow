"use server";

import { type TemplateStepFormData } from "~/features/templates/schemas";
import { getTemplateWithSteps } from "~/features/templates/server/db/queries";
import { type ActionResponse } from "~/lib/action-types";

export async function getTemplateStepsAction(templateId: string): ActionResponse<{ steps: TemplateStepFormData[] }> {
  const [error, data] = await getTemplateWithSteps(templateId);

  if (error || !data) {
    return { success: false, error: "Nie udało się pobrać kroków szablonu" };
  }

  const steps: TemplateStepFormData[] = data.steps.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description ?? null
  }));

  return { success: true, data: { steps } };
}

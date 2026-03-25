import { createLogger } from "~/lib/logger";
import { db } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { templateSteps, templates, type Template } from "./schema";

const logger = createLogger({ module: "templates-db" });
const RESOURCE_NAME = "Template";

type TemplateStepInput = { title: string; description?: string };

export async function createTemplateWithSteps(
  contractorId: string,
  templateData: { name: string; description?: string; steps: TemplateStepInput[] }
): Promise<SupabaseServiceResult<Template>> {
  try {
    const result = await db.transaction(async (tx) => {
      const [template] = await tx
        .insert(templates)
        .values({ contractorId, name: templateData.name, description: templateData.description })
        .returning();

      if (!template) {
        throw SupabaseServiceError.unknown("Failed to insert template — no row returned");
      }

      if (templateData.steps.length > 0) {
        await tx.insert(templateSteps).values(
          templateData.steps.map((step, index) => ({
            templateId: template.id,
            title: step.title,
            description: step.description,
            orderIndex: index
          }))
        );
      }

      return template;
    });

    logger.info({ contractorId, templateId: result.id }, "Created template with steps");
    return [null, result];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to create template with steps");
    return [serviceError, null];
  }
}

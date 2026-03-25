import { eq } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import { db } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { templateSteps, templates, type Template, type TemplateStep } from "./schema";

const logger = createLogger({ module: "templates-db" });

export async function getTemplatesByContractor(contractorId: string): Promise<SupabaseServiceResult<Template[]>> {
  try {
    const rows = await db.select().from(templates).where(eq(templates.contractorId, contractorId));
    return [null, rows];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Template");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get templates");
    return [serviceError, null];
  }
}

export async function getTemplateWithSteps(
  templateId: string
): Promise<SupabaseServiceResult<{ template: Template; steps: TemplateStep[] }>> {
  try {
    const rows = await db.select().from(templates).where(eq(templates.id, templateId));
    const template = rows[0];

    if (!template) {
      const error = SupabaseServiceError.notFound("Template");
      logger.error({ templateId, errorCode: error.code }, "Template not found");
      return [error, null];
    }

    const steps = await db.select().from(templateSteps).where(eq(templateSteps.templateId, templateId));
    return [null, { template, steps }];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Template");
    logger.error({ templateId, errorCode: serviceError.code }, "Failed to get template with steps");
    return [serviceError, null];
  }
}

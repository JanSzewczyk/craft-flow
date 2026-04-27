import { eq } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import { db, type DbClient } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { templates, type Template } from "./schema";

const logger = createLogger({ module: "templates-db" });
const RESOURCE_NAME = "Template";

export async function createTemplate({
  contractorId,
  createTemplateData,
  dbClient = db
}: {
  contractorId: string;
  createTemplateData: Pick<Template, "name" | "description" | "steps">;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Template>> {
  try {
    const [template] = await dbClient
      .insert(templates)
      .values({
        contractorId,
        name: createTemplateData.name,
        description: createTemplateData.description,
        steps: createTemplateData.steps
      })
      .returning();

    if (!template) {
      const error = SupabaseServiceError.unknown("Failed to insert template — no row returned");
      logger.error({ contractorId, errorCode: error.code }, "Insert returned no rows");
      return [error, null];
    }

    logger.info({ contractorId, templateId: template.id }, "Created template");
    return [null, template];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to create template");
    return [serviceError, null];
  }
}

export async function updateTemplate({
  id,
  updateInput,
  dbClient = db
}: {
  id: string;
  updateInput: Pick<Template, "name" | "description" | "steps">;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Template>> {
  try {
    const [row] = await dbClient
      .update(templates)
      .set({
        name: updateInput.name,
        description: updateInput.description,
        steps: updateInput.steps,
        updatedAt: new Date()
      })
      .where(eq(templates.id, id))
      .returning();

    if (!row) {
      const error = SupabaseServiceError.notFound(RESOURCE_NAME);
      logger.error({ id, errorCode: error.code }, "Update returned no rows");
      return [error, null];
    }

    logger.info({ id }, "Updated template");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ id, errorCode: serviceError.code }, "Failed to update template");
    return [serviceError, null];
  }
}

export async function deleteTemplate({
  id,
  dbClient = db
}: {
  id: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Template>> {
  try {
    const [row] = await dbClient.delete(templates).where(eq(templates.id, id)).returning();

    if (!row) {
      const error = SupabaseServiceError.notFound(RESOURCE_NAME);
      logger.error({ id, errorCode: error.code }, "Delete returned no rows");
      return [error, null];
    }

    logger.info({ id }, "Deleted template");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ id, errorCode: serviceError.code }, "Failed to delete template");
    return [serviceError, null];
  }
}

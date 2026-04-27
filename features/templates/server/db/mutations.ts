import { eq } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import { db, type DbClient } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { templateSteps, templates, type Template } from "./schema";

const logger = createLogger({ module: "templates-db" });
const RESOURCE_NAME = "Template";

type TemplateStepInput = { title: string; description?: string | null };

export async function createTemplateWithSteps({
  contractorId,
  templateData,
  dbClient = db
}: {
  contractorId: string;
  templateData: { name: string; description?: string | null; steps: TemplateStepInput[] };
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Template>> {
  try {
    const result = await dbClient.transaction(async (tx) => {
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

export async function updateTemplate({
  id,
  data,
  dbClient = db
}: {
  id: string;
  data: { name: string; description?: string | null };
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Template>> {
  try {
    const [row] = await dbClient
      .update(templates)
      .set({ name: data.name, description: data.description, updatedAt: new Date() })
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
    const result = await dbClient.transaction(async (tx) => {
      await tx.delete(templateSteps).where(eq(templateSteps.templateId, id));
      const [row] = await tx.delete(templates).where(eq(templates.id, id)).returning();

      if (!row) {
        throw SupabaseServiceError.notFound(RESOURCE_NAME);
      }

      return row;
    });

    logger.info({ id }, "Deleted template");
    return [null, result];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ id, errorCode: serviceError.code }, "Failed to delete template");
    return [serviceError, null];
  }
}

export type ReplaceStepInput = { title: string; description?: string | null; orderIndex: number };

export async function replaceTemplateSteps({
  templateId,
  steps,
  dbClient = db
}: {
  templateId: string;
  steps: ReplaceStepInput[];
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Template>> {
  try {
    const result = await dbClient.transaction(async (tx) => {
      await tx.delete(templateSteps).where(eq(templateSteps.templateId, templateId));

      if (steps.length > 0) {
        await tx.insert(templateSteps).values(
          steps.map((step) => ({
            templateId,
            title: step.title,
            description: step.description,
            orderIndex: step.orderIndex
          }))
        );
      }

      const [row] = await tx
        .update(templates)
        .set({ updatedAt: new Date() })
        .where(eq(templates.id, templateId))
        .returning();

      if (!row) {
        throw SupabaseServiceError.notFound(RESOURCE_NAME);
      }

      return row;
    });

    logger.info({ templateId, stepsCount: steps.length }, "Replaced template steps");
    return [null, result];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ templateId, errorCode: serviceError.code }, "Failed to replace template steps");
    return [serviceError, null];
  }
}

export async function duplicateTemplate({
  templateId,
  newName,
  dbClient = db
}: {
  templateId: string;
  newName: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Template>> {
  try {
    const result = await dbClient.transaction(async (tx) => {
      const [original] = await tx.select().from(templates).where(eq(templates.id, templateId));

      if (!original) {
        throw SupabaseServiceError.notFound(RESOURCE_NAME);
      }

      const originalSteps = await tx.select().from(templateSteps).where(eq(templateSteps.templateId, templateId));

      const [newTemplate] = await tx
        .insert(templates)
        .values({
          contractorId: original.contractorId,
          name: newName,
          description: original.description
        })
        .returning();

      if (!newTemplate) {
        throw SupabaseServiceError.unknown("Failed to insert duplicated template — no row returned");
      }

      if (originalSteps.length > 0) {
        await tx.insert(templateSteps).values(
          originalSteps.map((step) => ({
            templateId: newTemplate.id,
            title: step.title,
            description: step.description,
            orderIndex: step.orderIndex
          }))
        );
      }

      return newTemplate;
    });

    logger.info({ templateId, newTemplateId: result.id }, "Duplicated template");
    return [null, result];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ templateId, errorCode: serviceError.code }, "Failed to duplicate template");
    return [serviceError, null];
  }
}

import { and, count, desc, eq, ilike, sql } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import { db, type DbClient } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";
import { type PaginationMeta } from "~/types/pagination";

import { templateSteps, templates, type Template, type TemplateStep } from "./schema";

const logger = createLogger({ module: "templates-db" });

export async function getTemplatesByContractor({
  contractorId,
  dbClient = db
}: {
  contractorId: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Template[]>> {
  try {
    const rows = await dbClient.select().from(templates).where(eq(templates.contractorId, contractorId));
    return [null, rows];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Template");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get templates");
    return [serviceError, null];
  }
}

export async function getTemplateWithSteps({
  templateId,
  dbClient = db
}: {
  templateId: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<{ template: Template; steps: TemplateStep[] }>> {
  try {
    const rows = await dbClient.select().from(templates).where(eq(templates.id, templateId));
    const template = rows[0];

    if (!template) {
      const error = SupabaseServiceError.notFound("Template");
      logger.error({ templateId, errorCode: error.code }, "Template not found");
      return [error, null];
    }

    const steps = await dbClient.select().from(templateSteps).where(eq(templateSteps.templateId, templateId));
    return [null, { template, steps }];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Template");
    logger.error({ templateId, errorCode: serviceError.code }, "Failed to get template with steps");
    return [serviceError, null];
  }
}

export type TemplateListItem = {
  id: string;
  name: string;
  description: string | null;
  stepsCount: number;
  previewSteps: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type TemplateListOptions = {
  search?: string;
  page: number;
  perPage: number;
};

export type TemplateListResult = {
  items: TemplateListItem[];
  pagination: PaginationMeta;
};

export async function getTemplateListByContractor({
  contractorId,
  options,
  dbClient = db
}: {
  contractorId: string;
  options: TemplateListOptions;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<TemplateListResult>> {
  try {
    const { search, page, perPage } = options;
    const offset = (page - 1) * perPage;

    const stepCountSubquery = dbClient
      .select({
        templateId: templateSteps.templateId,
        stepsCount: count().as("steps_count")
      })
      .from(templateSteps)
      .groupBy(templateSteps.templateId)
      .as("step_counts");

    const conditions = [eq(templates.contractorId, contractorId)];

    if (search) {
      conditions.push(ilike(templates.name, `%${search}%`));
    }

    const whereClause = and(...conditions)!;

    const [rows, countResult] = await Promise.all([
      dbClient
        .select({
          id: templates.id,
          name: templates.name,
          description: templates.description,
          stepsCount: sql<number>`coalesce(${stepCountSubquery.stepsCount}, 0)`,
          createdAt: templates.createdAt,
          updatedAt: templates.updatedAt
        })
        .from(templates)
        .leftJoin(stepCountSubquery, eq(templates.id, stepCountSubquery.templateId))
        .where(whereClause)
        .orderBy(desc(templates.updatedAt))
        .limit(perPage)
        .offset(offset),
      dbClient.select({ value: count() }).from(templates).where(whereClause)
    ]);

    // For each template, fetch up to 3 preview step titles
    const templateIds = rows.map((r) => r.id);
    const previewStepsMap = new Map<string, string[]>();

    if (templateIds.length > 0) {
      const allPreviewSteps = await dbClient
        .select({
          templateId: templateSteps.templateId,
          title: templateSteps.title,
          orderIndex: templateSteps.orderIndex
        })
        .from(templateSteps)
        .where(
          templateIds.length === 1
            ? eq(templateSteps.templateId, templateIds[0]!)
            : sql`${templateSteps.templateId} = ANY(ARRAY[${sql.join(
                templateIds.map((id) => sql`${id}::uuid`),
                sql`, `
              )}])`
        )
        .orderBy(templateSteps.templateId, templateSteps.orderIndex);

      for (const step of allPreviewSteps) {
        const existing = previewStepsMap.get(step.templateId) ?? [];
        if (existing.length < 3) {
          existing.push(step.title);
          previewStepsMap.set(step.templateId, existing);
        }
      }
    }

    const items: TemplateListItem[] = rows.map((row) => ({
      ...row,
      previewSteps: previewStepsMap.get(row.id) ?? []
    }));

    const totalCount = countResult[0]?.value ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

    return [
      null,
      {
        items,
        pagination: {
          totalCount,
          totalPages,
          currentPage: page,
          perPage,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    ];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Template");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get template list");
    return [serviceError, null];
  }
}

export async function getTemplateCountByContractor({
  contractorId,
  dbClient = db
}: {
  contractorId: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<number>> {
  try {
    const [row] = await dbClient
      .select({ value: count() })
      .from(templates)
      .where(eq(templates.contractorId, contractorId));

    return [null, row?.value ?? 0];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Template");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to count templates");
    return [serviceError, null];
  }
}

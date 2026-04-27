import { and, count, desc, eq, ilike } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import { db, type DbClient } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";
import { type PaginationMeta } from "~/types/pagination";

import { templates, type Template } from "./schema";

const logger = createLogger({ module: "templates-db" });
const RESOURCE_NAME = "Template";

export async function getTemplatesByContractor({
  contractorId,
  dbClient = db
}: {
  contractorId: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Array<Template>>> {
  try {
    const rows = await dbClient.select().from(templates).where(eq(templates.contractorId, contractorId));
    return [null, rows];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get templates");
    return [serviceError, null];
  }
}

export async function getTemplateById({
  templateId,
  dbClient = db
}: {
  templateId: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Template>> {
  try {
    const [template] = await dbClient.select().from(templates).where(eq(templates.id, templateId));

    if (!template) {
      const error = SupabaseServiceError.notFound(RESOURCE_NAME);
      logger.error({ templateId, errorCode: error.code }, "Template not found");
      return [error, null];
    }

    return [null, template];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ templateId, errorCode: serviceError.code }, "Failed to get template");
    return [serviceError, null];
  }
}

export type TemplateListItem = {
  id: string;
  name: string;
  description: string | null;
  stepsCount: number;
  previewSteps: Array<string>;
  createdAt: Date;
  updatedAt: Date;
};

export type TemplateListOptions = {
  search?: string;
  page: number;
  perPage: number;
};

export type TemplateListResult = {
  items: Array<TemplateListItem>;
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

    const conditions = [eq(templates.contractorId, contractorId)];

    if (search) {
      conditions.push(ilike(templates.name, `%${search}%`));
    }

    const whereClause = and(...conditions)!;

    const [rows, countResult] = await Promise.all([
      dbClient
        .select()
        .from(templates)
        .where(whereClause)
        .orderBy(desc(templates.updatedAt))
        .limit(perPage)
        .offset(offset),
      dbClient.select({ value: count() }).from(templates).where(whereClause)
    ]);

    const items: Array<TemplateListItem> = rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      stepsCount: row.steps.length,
      previewSteps: row.steps.slice(0, 3).map((s) => s.title),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
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
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
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
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to count templates");
    return [serviceError, null];
  }
}

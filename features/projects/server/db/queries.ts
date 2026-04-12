import { and, count, desc, eq, ilike, ne, or, sql } from "drizzle-orm";

import { clients } from "~/features/crm/server/db/schema";
import { isFilterableStatus, type ProjectStatusFilter } from "~/features/projects/types/project-filter";
import { createLogger } from "~/lib/logger";
import { db } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { projectSteps, projects, type Project, type ProjectStep, type ProjectStatus } from "./schema";

const logger = createLogger({ module: "projects-db" });

export async function getProjectsByContractor(contractorId: string): Promise<SupabaseServiceResult<Project[]>> {
  try {
    const rows = await db.select().from(projects).where(eq(projects.contractorId, contractorId));
    return [null, rows];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Project");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get projects");
    return [serviceError, null];
  }
}

export async function getProjectById(id: string): Promise<SupabaseServiceResult<Project>> {
  try {
    const rows = await db.select().from(projects).where(eq(projects.id, id));
    const row = rows[0];

    if (!row) {
      const error = SupabaseServiceError.notFound("Project");
      logger.error({ id, errorCode: error.code }, "Project not found");
      return [error, null];
    }

    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Project");
    logger.error({ id, errorCode: serviceError.code }, "Failed to get project");
    return [serviceError, null];
  }
}

export async function getProjectSteps(projectId: string): Promise<SupabaseServiceResult<ProjectStep[]>> {
  try {
    const rows = await db.select().from(projectSteps).where(eq(projectSteps.projectId, projectId));
    return [null, rows];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "ProjectStep");
    logger.error({ projectId, errorCode: serviceError.code }, "Failed to get project steps");
    return [serviceError, null];
  }
}

export type ProjectListItem = {
  id: string;
  name: string;
  status: string;
  clientName: string;
  lastClientViewAt: Date | null;
  updatedAt: Date;
  totalSteps: number;
  completedSteps: number;
};

export type ProjectListOptions = {
  status?: ProjectStatus;
  search?: string;
  page: number;
  perPage: number;
};

export type PaginationMeta = {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ProjectListResult = {
  items: Array<ProjectListItem>;
  pagination: PaginationMeta;
};

export async function getProjectListByContractor(
  contractorId: string,
  options: ProjectListOptions
): Promise<SupabaseServiceResult<ProjectListResult>> {
  try {
    const { status, search, page, perPage } = options;
    const offset = (page - 1) * perPage;

    const stepCountSubquery = db
      .select({
        projectId: projectSteps.projectId,
        totalSteps: count().as("total_steps"),
        completedSteps: sql<number>`count(*) filter (where ${projectSteps.isCompleted} = true)`.as("completed_steps")
      })
      .from(projectSteps)
      .groupBy(projectSteps.projectId)
      .as("step_counts");

    const conditions = [eq(projects.contractorId, contractorId), ne(projects.status, "DELETED")];

    if (status) {
      conditions.push(eq(projects.status, status));
    }

    if (search) {
      const pattern = `%${search}%`;
      conditions.push(or(ilike(projects.name, pattern), ilike(clients.name, pattern))!);
    }

    const whereClause = and(...conditions)!;

    const [items, countResult] = await Promise.all([
      db
        .select({
          id: projects.id,
          name: projects.name,
          status: projects.status,
          clientName: clients.name,
          lastClientViewAt: projects.lastClientViewAt,
          updatedAt: projects.updatedAt,
          totalSteps: sql<number>`coalesce(${stepCountSubquery.totalSteps}, 0)`,
          completedSteps: sql<number>`coalesce(${stepCountSubquery.completedSteps}, 0)`
        })
        .from(projects)
        .innerJoin(clients, eq(projects.clientId, clients.id))
        .leftJoin(stepCountSubquery, eq(projects.id, stepCountSubquery.projectId))
        .where(whereClause)
        .orderBy(desc(projects.updatedAt))
        .limit(perPage)
        .offset(offset),
      db
        .select({ value: count() })
        .from(projects)
        .innerJoin(clients, eq(projects.clientId, clients.id))
        .where(whereClause)
    ]);

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
    const serviceError = categorizeSupabaseError(error, "Project");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get project list");
    return [serviceError, null];
  }
}

export type ProjectCountsByStatus = Record<ProjectStatusFilter, number>;

export async function getProjectCountsByStatus(
  contractorId: string
): Promise<SupabaseServiceResult<ProjectCountsByStatus>> {
  try {
    const rows = await db
      .select({
        status: projects.status,
        count: count()
      })
      .from(projects)
      .where(and(eq(projects.contractorId, contractorId), ne(projects.status, "DELETED")))
      .groupBy(projects.status);

    let all = 0;
    const counts: ProjectCountsByStatus = {
      ALL: 0,
      ACTIVE: 0,
      ARCHIVED: 0,
      COMPLETED: 0,
      DRAFT: 0
    };
    for (const row of rows) {
      if (isFilterableStatus(row.status)) {
        counts[row.status] = row.count;
        all += row.count;
      }
    }
    counts.ALL = all;

    return [null, counts];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Project");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get project counts by status");
    return [serviceError, null];
  }
}

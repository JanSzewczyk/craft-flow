import * as React from "react";

import { and, asc, count, desc, eq, gte, ilike, inArray, ne, or, sql } from "drizzle-orm";

import { clients } from "~/features/crm/server/db/schema";
import { isFilterableStatus, type ProjectStatusFilter } from "~/features/projects/types/project-filter";
import { createLogger } from "~/lib/logger";
import { db, type DbClient } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";
import { type PaginationMeta } from "~/types/pagination";

import { projectSteps, projects, ProjectStatus, type ProjectStep, type Project, type ProjectRow } from "./schema";

const logger = createLogger({ module: "projects-db" });

export async function getProjectsByContractor({
  contractorId,
  dbClient = db
}: {
  contractorId: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Array<ProjectRow>>> {
  try {
    const rows = await dbClient.select().from(projects).where(eq(projects.contractorId, contractorId));
    return [null, rows];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Project");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get projects");
    return [serviceError, null];
  }
}

export const getProjectById = React.cache(async function ({
  projectId,
  dbClient = db
}: {
  projectId: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Project>> {
  try {
    const row = await dbClient.query.projects.findFirst({
      where: eq(projects.id, projectId),
      with: { client: true, steps: true }
    });

    if (!row) {
      const error = SupabaseServiceError.notFound("Project");
      logger.error({ projectId, errorCode: error.code }, "Project not found");
      return [error, null];
    }

    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Project");
    logger.error({ projectId, errorCode: serviceError.code }, "Failed to get project");
    return [serviceError, null];
  }
});

export async function getProjectSteps({
  projectId,
  dbClient = db
}: {
  projectId: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<ProjectStep[]>> {
  try {
    const rows = await dbClient.select().from(projectSteps).where(eq(projectSteps.projectId, projectId));
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
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
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

export type ProjectListResult = {
  items: Array<ProjectListItem>;
  pagination: PaginationMeta;
};

export async function getProjectListByContractor({
  contractorId,
  options,
  dbClient = db
}: {
  contractorId: string;
  options: ProjectListOptions;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<ProjectListResult>> {
  try {
    const { status, search, page, perPage } = options;
    const offset = (page - 1) * perPage;

    const stepCountSubquery = dbClient
      .select({
        projectId: projectSteps.projectId,
        totalSteps: count().as("total_steps"),
        completedSteps: sql<number>`count(*) filter (where ${projectSteps.isCompleted} = true)`.as("completed_steps")
      })
      .from(projectSteps)
      .groupBy(projectSteps.projectId)
      .as("step_counts");

    const conditions = [eq(projects.contractorId, contractorId), ne(projects.status, ProjectStatus.DELETED)];

    if (status) {
      conditions.push(eq(projects.status, status));
    }

    if (search) {
      const pattern = `%${search}%`;
      conditions.push(or(ilike(projects.name, pattern), ilike(clients.name, pattern))!);
    }

    const whereClause = and(...conditions)!;

    const [items, countResult] = await Promise.all([
      dbClient
        .select({
          id: projects.id,
          name: projects.name,
          status: projects.status,
          clientName: clients.name,
          lastClientViewAt: projects.lastClientViewAt,
          startedAt: projects.startedAt,
          completedAt: projects.completedAt,
          createdAt: projects.createdAt,
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
      dbClient
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

export async function getProjectCountsByStatus({
  contractorId,
  dbClient = db
}: {
  contractorId: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<ProjectCountsByStatus>> {
  try {
    const rows = await dbClient
      .select({
        status: projects.status,
        count: count()
      })
      .from(projects)
      .where(and(eq(projects.contractorId, contractorId), ne(projects.status, ProjectStatus.DELETED)))
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

export async function getProjectCountStartedSince({
  contractorId,
  since,
  dbClient = db
}: {
  contractorId: string;
  since: Date;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<number>> {
  try {
    const [row] = await dbClient
      .select({ value: count() })
      .from(projects)
      .where(
        and(
          eq(projects.contractorId, contractorId),
          gte(projects.startedAt, since),
          ne(projects.status, ProjectStatus.DELETED),
          ne(projects.status, ProjectStatus.DRAFT)
        )
      );

    const value = row?.value ?? 0;
    return [null, value];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Project");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to count projects created since date");
    return [serviceError, null];
  }
}

export const getProjectByPublicToken = React.cache(async function ({
  token,
  dbClient = db
}: {
  token: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Project>> {
  try {
    const row = await dbClient.query.projects.findFirst({
      where: and(
        eq(projects.publicToken, token),
        inArray(projects.status, [ProjectStatus.ACTIVE, ProjectStatus.COMPLETED])
      ),
      with: {
        client: true,
        steps: {
          orderBy: asc(projectSteps.orderIndex)
        }
      }
    });

    if (!row) {
      const error = SupabaseServiceError.notFound("Project");
      logger.error({ token, errorCode: error.code }, "Project not found by public token");
      return [error, null];
    }

    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Project");
    logger.error({ token, errorCode: serviceError.code }, "Failed to get project by public token");
    return [serviceError, null];
  }
});

export async function getProjectLastClientViewAt({
  projectId,
  dbClient = db
}: {
  projectId: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Date | null>> {
  try {
    const row = await dbClient.query.projects.findFirst({
      where: eq(projects.id, projectId),
      columns: { lastClientViewAt: true }
    });

    if (!row) {
      const error = SupabaseServiceError.notFound("Project");
      logger.error({ projectId, errorCode: error.code }, "Project not found for lastClientViewAt check");
      return [error, null];
    }

    return [null, row.lastClientViewAt ?? null];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Project");
    logger.error({ projectId, errorCode: serviceError.code }, "Failed to get project lastClientViewAt");
    return [serviceError, null];
  }
}

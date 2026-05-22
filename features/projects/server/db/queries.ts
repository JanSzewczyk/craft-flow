import * as React from "react";

import { and, asc, count, desc, eq, gte, ilike, inArray, ne, or, sql } from "drizzle-orm";

import { contractorProfile } from "~/features/contractor/server/db/contractor-profile/schema";
import { clients } from "~/features/crm/server/db/schema";
import {
  type ClientContractorListItem,
  type ContractorListOptions,
  type ContractorListResult
} from "~/features/projects/types/contractor";
import { isFilterableStatus, type ProjectStatusFilter } from "~/features/projects/types/project-filter";
import {
  ProjectStatus,
  type ClientProjectListItem,
  type ProjectListItem,
  type ProjectListOptions,
  type ProjectListResult
} from "~/features/projects/types/project";
import { addresses } from "~/features/shared/server/db/schema";
import { createLogger } from "~/lib/logger";
import { db, type DbClient } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { type ProjectRow, type ProjectStep } from "~/features/projects/types/project";

import { projectSteps, projects, type Project } from "./schema";

export type { ProjectListItem, ProjectListOptions, ProjectListResult };

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

export async function getProjectListByClientIds({
  clientIds,
  statuses,
  dbClient = db
}: {
  clientIds: Array<string>;
  statuses: Array<ProjectStatus>;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Array<ClientProjectListItem>>> {
  try {
    const stepCountSubquery = dbClient
      .select({
        projectId: projectSteps.projectId,
        totalSteps: count().as("total_steps"),
        completedSteps: sql<number>`count(*) filter (where ${projectSteps.isCompleted} = true)`.as("completed_steps")
      })
      .from(projectSteps)
      .groupBy(projectSteps.projectId)
      .as("step_counts");

    const rows = await dbClient
      .select({
        id: projects.id,
        name: projects.name,
        status: projects.status,
        contractorCompanyName: contractorProfile.companyName,
        totalSteps: sql<number>`coalesce(${stepCountSubquery.totalSteps}, 0)`,
        completedSteps: sql<number>`coalesce(${stepCountSubquery.completedSteps}, 0)`,
        startedAt: projects.startedAt,
        completedAt: projects.completedAt,
        updatedAt: projects.updatedAt,
        createdAt: projects.createdAt
      })
      .from(projects)
      .innerJoin(contractorProfile, eq(projects.contractorId, contractorProfile.id))
      .leftJoin(stepCountSubquery, eq(projects.id, stepCountSubquery.projectId))
      .where(and(inArray(projects.clientId, clientIds), inArray(projects.status, statuses)))
      .orderBy(desc(projects.updatedAt));

    return [null, rows];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Project");
    logger.error({ clientIds, errorCode: serviceError.code }, "Failed to get project list by client ids");
    return [serviceError, null];
  }
}

function buildContractorListItem(row: {
  id: string;
  companyName: string;
  industry: string;
  email: string;
  phone: string | null;
  logoUrl: string | null;
  brandColor: string | null;
  projectCount: number;
  activeProjectCount: number;
  addressStreet: string | null;
  addressPostalCode: string | null;
  addressCity: string | null;
  addressCountry: string | null;
  addressAdditionalInfo: string | null;
}): ClientContractorListItem {
  return {
    id: row.id,
    companyName: row.companyName,
    industry: row.industry,
    email: row.email,
    phone: row.phone,
    logoUrl: row.logoUrl,
    brandColor: row.brandColor,
    projectCount: row.projectCount,
    activeProjectCount: row.activeProjectCount,
    address: row.addressStreet
      ? {
          street: row.addressStreet,
          postalCode: row.addressPostalCode!,
          city: row.addressCity!,
          country: row.addressCountry!,
          additionalInfo: row.addressAdditionalInfo ?? null
        }
      : null
  };
}

const CONTRACTOR_SELECT = (dbClient: DbClient) => ({
  id: contractorProfile.id,
  companyName: contractorProfile.companyName,
  industry: contractorProfile.industry,
  email: contractorProfile.email,
  phone: contractorProfile.phone,
  logoUrl: contractorProfile.logoUrl,
  brandColor: contractorProfile.brandColor,
  projectCount: sql<number>`cast(count(${projects.id}) as int)`,
  activeProjectCount: sql<number>`cast(count(${projects.id}) filter (where ${projects.status} = ${ProjectStatus.ACTIVE}) as int)`,
  addressStreet: addresses.street,
  addressPostalCode: addresses.postalCode,
  addressCity: addresses.city,
  addressCountry: addresses.country,
  addressAdditionalInfo: addresses.additionalInfo
});

const CONTRACTOR_GROUP_BY = [
  contractorProfile.id,
  contractorProfile.companyName,
  contractorProfile.industry,
  contractorProfile.email,
  contractorProfile.phone,
  contractorProfile.logoUrl,
  contractorProfile.brandColor,
  addresses.street,
  addresses.postalCode,
  addresses.city,
  addresses.country,
  addresses.additionalInfo
] as const;

export async function getContractorListByClientIds({
  clientIds,
  options,
  dbClient = db
}: {
  clientIds: Array<string>;
  options: ContractorListOptions;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<ContractorListResult>> {
  try {
    const { search, page, perPage } = options;
    const offset = (page - 1) * perPage;

    const baseConditions = [inArray(projects.clientId, clientIds), ne(projects.status, ProjectStatus.DELETED)];
    if (search) {
      baseConditions.push(ilike(contractorProfile.companyName, `%${search}%`));
    }
    const whereClause = and(...baseConditions)!;

    const [rows, countResult] = await Promise.all([
      dbClient
        .select(CONTRACTOR_SELECT(dbClient))
        .from(projects)
        .innerJoin(contractorProfile, eq(projects.contractorId, contractorProfile.id))
        .leftJoin(addresses, eq(contractorProfile.addressId, addresses.id))
        .where(whereClause)
        .groupBy(...CONTRACTOR_GROUP_BY)
        .orderBy(asc(contractorProfile.companyName))
        .limit(perPage)
        .offset(offset),
      dbClient
        .select({ value: sql<number>`cast(count(distinct ${contractorProfile.id}) as int)` })
        .from(projects)
        .innerJoin(contractorProfile, eq(projects.contractorId, contractorProfile.id))
        .where(whereClause)
    ]);

    const totalCount = countResult[0]?.value ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

    return [
      null,
      {
        items: rows.map(buildContractorListItem),
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
    const serviceError = categorizeSupabaseError(error, "Contractor");
    logger.error({ clientIds, errorCode: serviceError.code }, "Failed to get contractor list by client ids");
    return [serviceError, null];
  }
}

export async function getContractorByClientIdsAndContractorId({
  clientIds,
  contractorId,
  dbClient = db
}: {
  clientIds: Array<string>;
  contractorId: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<ClientContractorListItem>> {
  try {
    const [row] = await dbClient
      .select(CONTRACTOR_SELECT(dbClient))
      .from(projects)
      .innerJoin(contractorProfile, eq(projects.contractorId, contractorProfile.id))
      .leftJoin(addresses, eq(contractorProfile.addressId, addresses.id))
      .where(
        and(
          inArray(projects.clientId, clientIds),
          eq(projects.contractorId, contractorId),
          ne(projects.status, ProjectStatus.DELETED)
        )
      )
      .groupBy(...CONTRACTOR_GROUP_BY);

    if (!row) {
      const error = SupabaseServiceError.notFound("Contractor");
      logger.error({ contractorId, errorCode: error.code }, "Contractor not found for client");
      return [error, null];
    }

    return [null, buildContractorListItem(row)];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Contractor");
    logger.error(
      { contractorId, errorCode: serviceError.code },
      "Failed to get contractor by client ids and contractor id"
    );
    return [serviceError, null];
  }
}

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

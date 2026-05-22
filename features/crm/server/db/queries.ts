import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import { db, type DbClient } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";
import { projects } from "~/lib/supabase/schema";

import {
  type Client,
  type ClientListItem,
  type ClientListOptions,
  type ClientListResult
} from "~/features/crm/types/client";

import { clients } from "./schema";

export type { ClientListItem, ClientListOptions, ClientListResult };

const logger = createLogger({ module: "crm-db" });

export async function getClientsByContractorId({
  contractorId,
  dbClient = db
}: {
  contractorId: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Client[]>> {
  try {
    const rows = await dbClient.select().from(clients).where(eq(clients.contractorId, contractorId));
    return [null, rows];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Client");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get clients");
    return [serviceError, null];
  }
}

export async function getClientById({
  id,
  dbClient = db
}: {
  id: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Client>> {
  try {
    const rows = await dbClient.select().from(clients).where(eq(clients.id, id));
    const row = rows[0];

    if (!row) {
      const error = SupabaseServiceError.notFound("Client");
      logger.error({ id, errorCode: error.code }, "Client not found");
      return [error, null];
    }

    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Client");
    logger.error({ id, errorCode: serviceError.code }, "Failed to get client");
    return [serviceError, null];
  }
}

export async function getClientListByContractorId({
  contractorId,
  options,
  dbClient = db
}: {
  contractorId: string;
  options: ClientListOptions;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<ClientListResult>> {
  try {
    const { search, page, perPage } = options;
    const offset = (page - 1) * perPage;

    const conditions = [eq(clients.contractorId, contractorId)];

    if (search) {
      conditions.push(or(ilike(clients.name, `%${search}%`), ilike(clients.email, `%${search}%`))!);
    }

    const whereClause = and(...conditions)!;

    const projectCountSubquery = dbClient
      .select({
        clientId: projects.clientId,
        projectCount: count().as("project_count")
      })
      .from(projects)
      .groupBy(projects.clientId)
      .as("project_counts");

    const [rows, countResult] = await Promise.all([
      dbClient
        .select({
          id: clients.id,
          contractorId: clients.contractorId,
          name: clients.name,
          email: clients.email,
          phone: clients.phone,
          clerkUserId: clients.clerkUserId,
          projectCount: sql<number>`coalesce(${projectCountSubquery.projectCount}, 0)`,
          createdAt: clients.createdAt
        })
        .from(clients)
        .leftJoin(projectCountSubquery, eq(clients.id, projectCountSubquery.clientId))
        .where(whereClause)
        .orderBy(desc(clients.createdAt))
        .limit(perPage)
        .offset(offset),
      dbClient.select({ value: count() }).from(clients).where(whereClause)
    ]);

    const totalCount = countResult[0]?.value ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

    const items: Array<ClientListItem> = rows.map((row) => ({
      id: row.id,
      contractorId: row.contractorId,
      name: row.name,
      email: row.email,
      phone: row.phone,
      clerkUserId: row.clerkUserId,
      hasProjects: row.projectCount > 0,
      createdAt: row.createdAt
    }));

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
    const serviceError = categorizeSupabaseError(error, "Client");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get client list");
    return [serviceError, null];
  }
}

export async function getClientCountByContractorId({
  contractorId,
  dbClient = db
}: {
  contractorId: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<number>> {
  try {
    const [row] = await dbClient.select({ value: count() }).from(clients).where(eq(clients.contractorId, contractorId));

    return [null, row?.value ?? 0];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Client");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to count clients");
    return [serviceError, null];
  }
}

export async function getOptionalClientByContractorIdAndEmail({
  contractorId,
  email,
  dbClient = db
}: {
  contractorId: string;
  email: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Client | null>> {
  try {
    const [row] = await dbClient
      .select()
      .from(clients)
      .where(and(eq(clients.contractorId, contractorId), eq(clients.email, email)));

    if (!row) {
      logger.warn({ contractorId, email }, "Client not found");
      return [null, null];
    }

    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Client");
    logger.error({ errorCode: serviceError.code, contractorId, email }, "Failed to get client");
    return [serviceError, null];
  }
}

export async function getClientsByClerkUserId({
  clerkUserId,
  dbClient = db
}: {
  clerkUserId: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Array<Client>>> {
  try {
    const rows = await dbClient.select().from(clients).where(eq(clients.clerkUserId, clerkUserId));
    return [null, rows];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Client");
    logger.error({ clerkUserId, errorCode: serviceError.code }, "Failed to get clients by clerkUserId");
    return [serviceError, null];
  }
}

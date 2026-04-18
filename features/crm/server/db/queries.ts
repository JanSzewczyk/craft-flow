import { and, count, desc, eq, ilike, or } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import { db } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";
import { projects } from "~/lib/supabase/schema";
import { type PaginationMeta } from "~/types/pagination";

import { clients, type Client } from "./schema";

const logger = createLogger({ module: "crm-db" });

export async function getClientsByContractor(contractorId: string): Promise<SupabaseServiceResult<Client[]>> {
  try {
    const rows = await db.select().from(clients).where(eq(clients.contractorId, contractorId));
    return [null, rows];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Client");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get clients");
    return [serviceError, null];
  }
}

export async function getClientById(id: string): Promise<SupabaseServiceResult<Client>> {
  try {
    const rows = await db.select().from(clients).where(eq(clients.id, id));
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

export type ClientListItem = {
  id: string;
  contractorId: string;
  name: string;
  email: string;
  phone: string | null;
  clerkUserId: string | null;
  hasProjects: boolean;
  createdAt: Date;
};

export type ClientListOptions = {
  search?: string;
  page: number;
  perPage: number;
};

export type ClientListResult = {
  items: ClientListItem[];
  pagination: PaginationMeta;
};

export async function getClientListByContractor(
  contractorId: string,
  options: ClientListOptions
): Promise<SupabaseServiceResult<ClientListResult>> {
  try {
    const { search, page, perPage } = options;
    const offset = (page - 1) * perPage;

    const conditions = [eq(clients.contractorId, contractorId)];

    if (search) {
      conditions.push(or(ilike(clients.name, `%${search}%`), ilike(clients.email, `%${search}%`))!);
    }

    const whereClause = and(...conditions)!;

    const projectCountSubquery = db
      .select({
        clientId: projects.clientId,
        projectCount: count().as("project_count")
      })
      .from(projects)
      .groupBy(projects.clientId)
      .as("project_counts");

    const [rows, countResult] = await Promise.all([
      db
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
      db.select({ value: count() }).from(clients).where(whereClause)
    ]);

    const totalCount = countResult[0]?.value ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

    const items: ClientListItem[] = rows.map((row) => ({
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

export async function getClientCountByContractor(contractorId: string): Promise<SupabaseServiceResult<number>> {
  try {
    const [row] = await db.select({ value: count() }).from(clients).where(eq(clients.contractorId, contractorId));

    return [null, row?.value ?? 0];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Client");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to count clients");
    return [serviceError, null];
  }
}

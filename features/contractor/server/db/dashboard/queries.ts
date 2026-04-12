import { cache } from "react";

import { and, count, desc, eq, gte } from "drizzle-orm";

import { clients } from "~/features/crm/server/db/schema";
import { projects } from "~/features/projects/server/db/schema";
import { createLogger } from "~/lib/logger";
import { db } from "~/lib/supabase/db";
import { categorizeSupabaseError, type SupabaseServiceResult } from "~/lib/supabase/errors";

const logger = createLogger({ module: "contractor-dashboard-db" });
const RESOURCE_NAME = "DashboardData";

export type RecentActivityItem = {
  projectId: string;
  projectName: string;
  projectStatus: string;
  clientName: string;
  clientEmail: string;
  lastClientViewAt: Date | null;
  updatedAt: Date;
};

export async function getActiveProjectsCount(contractorId: string): Promise<SupabaseServiceResult<number>> {
  try {
    const rows = await db
      .select({ value: count() })
      .from(projects)
      .where(and(eq(projects.contractorId, contractorId), eq(projects.status, "ACTIVE")));

    const value = rows[0]?.value ?? 0;
    return [null, value];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get active projects count");
    return [serviceError, null];
  }
}

export async function getCompletedProjectsThisMonth(contractorId: string): Promise<SupabaseServiceResult<number>> {
  try {
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

    const rows = await db
      .select({ value: count() })
      .from(projects)
      .where(
        and(
          eq(projects.contractorId, contractorId),
          eq(projects.status, "COMPLETED"),
          gte(projects.updatedAt, startOfMonth)
        )
      );

    const value = rows[0]?.value ?? 0;
    return [null, value];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get completed projects this month");
    return [serviceError, null];
  }
}

export async function getRecentActivity(
  contractorId: string,
  limit = 5
): Promise<SupabaseServiceResult<Array<RecentActivityItem>>> {
  try {
    const rows = await db
      .select({
        projectId: projects.id,
        projectName: projects.name,
        projectStatus: projects.status,
        clientName: clients.name,
        clientEmail: clients.email,
        lastClientViewAt: projects.lastClientViewAt,
        updatedAt: projects.updatedAt
      })
      .from(projects)
      .innerJoin(clients, eq(projects.clientId, clients.id))
      .where(eq(projects.contractorId, contractorId))
      .orderBy(desc(projects.updatedAt))
      .limit(limit);

    return [null, rows];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get recent activity");
    return [serviceError, null];
  }
}

export const getCachedActiveProjectsCount = cache(getActiveProjectsCount);
export const getCachedCompletedProjectsThisMonth = cache(getCompletedProjectsThisMonth);
export const getCachedRecentActivity = cache(getRecentActivity);

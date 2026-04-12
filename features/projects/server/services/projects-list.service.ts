import { cache } from "react";

import {
  getProjectListByContractor,
  getProjectCountsByStatus,
  type ProjectListOptions,
  type ProjectListResult
} from "~/features/projects/server/db";
import { type ProjectCountsByStatus } from "~/features/projects/server/db/queries";
import { createLogger } from "~/lib/logger";
import { type SupabaseServiceResult } from "~/lib/supabase/errors";

const logger = createLogger({ module: "projects-list-service" });

async function _getProjectList(
  userId: string,
  options: ProjectListOptions
): Promise<SupabaseServiceResult<ProjectListResult>> {
  logger.info({ userId, ...options }, "Loading project list");
  return getProjectListByContractor(userId, options);
}

async function _getProjectStatusCounts(userId: string): Promise<SupabaseServiceResult<ProjectCountsByStatus>> {
  logger.info({ userId }, "Loading project status counts");
  return getProjectCountsByStatus(userId);
}

export const getCachedProjectList = cache(_getProjectList);
export const getCachedProjectStatusCounts = cache(_getProjectStatusCounts);

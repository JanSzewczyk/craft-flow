import { eq } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import { db } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { projectSteps, projects, type Project, type ProjectStep } from "./schema";

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

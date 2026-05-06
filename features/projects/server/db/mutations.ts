import { eq } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import { db, type DbClient } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { type ProjectRow, projectSteps, projects, type ProjectStep } from "./schema";

const logger = createLogger({ module: "projects-db" });

type ProjectInput = Pick<ProjectRow, "clientId" | "name" | "publicToken" | "status" | "description">;

export async function createProjectByContractorId({
  contractorId,
  data,
  dbClient = db
}: {
  contractorId: string;
  data: ProjectInput;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<ProjectRow>> {
  try {
    const [row] = await dbClient
      .insert(projects)
      .values({ contractorId, ...data })
      .returning();

    if (!row) {
      const error = SupabaseServiceError.unknown("Failed to create project — no row returned");
      logger.error({ contractorId, errorCode: error.code }, "Insert returned no rows");
      return [error, null];
    }

    logger.info({ contractorId, projectId: row.id }, "Created project");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Project");
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to create project");
    return [serviceError, null];
  }
}

export async function updateProject({
  id,
  data,
  dbClient = db
}: {
  id: string;
  data: Partial<Pick<ProjectRow, "name" | "status">>;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<ProjectRow>> {
  try {
    const [row] = await dbClient
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();

    if (!row) {
      const error = SupabaseServiceError.notFound("Project");
      logger.error({ id, errorCode: error.code }, "Update returned no rows");
      return [error, null];
    }

    logger.info({ id }, "Updated project");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Project");
    logger.error({ id, errorCode: serviceError.code }, "Failed to update project");
    return [serviceError, null];
  }
}

export async function deleteProject({
  id,
  dbClient = db
}: {
  id: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<ProjectRow>> {
  try {
    const [row] = await dbClient.delete(projects).where(eq(projects.id, id)).returning();

    if (!row) {
      const error = SupabaseServiceError.notFound("Project");
      logger.error({ id, errorCode: error.code }, "Delete returned no rows");
      return [error, null];
    }

    logger.info({ id }, "Deleted project");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Project");
    logger.error({ id, errorCode: serviceError.code }, "Failed to delete project");
    return [serviceError, null];
  }
}

export async function createProjectStep({
  data,
  dbClient = db
}: {
  data: Pick<ProjectStep, "projectId" | "title" | "description" | "orderIndex">;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<ProjectStep>> {
  try {
    const [row] = await dbClient.insert(projectSteps).values(data).returning();

    if (!row) {
      const error = SupabaseServiceError.unknown("Failed to create project step — no row returned");
      logger.error({ projectId: data.projectId, errorCode: error.code }, "Insert returned no rows");
      return [error, null];
    }

    logger.info({ projectId: data.projectId, stepId: row.id }, "Created project step");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "ProjectStep");
    logger.error({ projectId: data.projectId, errorCode: serviceError.code }, "Failed to create project step");
    return [serviceError, null];
  }
}

export async function updateProjectStepCompletion({
  stepId,
  completed,
  dbClient = db
}: {
  stepId: string;
  completed: boolean;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<ProjectStep>> {
  try {
    const [row] = await dbClient
      .update(projectSteps)
      .set({
        isCompleted: completed,
        completedAt: completed ? new Date() : null,
        updatedAt: new Date()
      })
      .where(eq(projectSteps.id, stepId))
      .returning();

    if (!row) {
      const error = SupabaseServiceError.notFound("ProjectStep");
      logger.error({ stepId, errorCode: error.code }, "Update returned no rows");
      return [error, null];
    }

    logger.info({ stepId, completed }, "Updated project step completion");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "ProjectStep");
    logger.error({ stepId, errorCode: serviceError.code }, "Failed to update project step completion");
    return [serviceError, null];
  }
}

export async function reorderProjectSteps({
  projectId,
  steps,
  dbClient = db
}: {
  projectId: string;
  steps: { id: string; orderIndex: number }[];
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<ProjectStep[]>> {
  try {
    const updated = await dbClient.transaction(async (tx) => {
      const rows: ProjectStep[] = [];
      for (const step of steps) {
        const [row] = await tx
          .update(projectSteps)
          .set({ orderIndex: step.orderIndex, updatedAt: new Date() })
          .where(eq(projectSteps.id, step.id))
          .returning();
        if (row) rows.push(row);
      }
      return rows;
    });

    logger.info({ projectId, count: updated.length }, "Reordered project steps");
    return [null, updated];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "ProjectStep");
    logger.error({ projectId, errorCode: serviceError.code }, "Failed to reorder project steps");
    return [serviceError, null];
  }
}

export async function createProjectSteps({
  projectId,
  steps,
  dbClient = db
}: {
  projectId: string;
  steps: Array<Pick<ProjectStep, "title" | "description" | "orderIndex">>;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<ProjectStep[]>> {
  try {
    const rows = await dbClient
      .insert(projectSteps)
      .values(steps.map((s) => ({ projectId, title: s.title, description: s.description, orderIndex: s.orderIndex })))
      .returning();

    logger.info({ projectId, stepCount: rows.length }, "Created project steps");
    return [null, rows];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "ProjectStep");
    logger.error({ projectId, errorCode: serviceError.code }, "Failed to create project steps");
    return [serviceError, null];
  }
}

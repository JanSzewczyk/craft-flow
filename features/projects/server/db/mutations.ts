import { eq } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import { db } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { projectSteps, projects, type Project, type ProjectStep } from "./schema";

const logger = createLogger({ module: "projects-db" });

type ProjectInput = Pick<Project, "contractorId" | "clientId" | "name" | "publicToken"> &
  Partial<Pick<Project, "status">>;

export async function createProject(data: ProjectInput): Promise<SupabaseServiceResult<Project>> {
  try {
    const [row] = await db.insert(projects).values(data).returning();

    if (!row) {
      const error = SupabaseServiceError.unknown("Failed to create project — no row returned");
      logger.error({ contractorId: data.contractorId, errorCode: error.code }, "Insert returned no rows");
      return [error, null];
    }

    logger.info({ contractorId: data.contractorId, projectId: row.id }, "Created project");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Project");
    logger.error({ contractorId: data.contractorId, errorCode: serviceError.code }, "Failed to create project");
    return [serviceError, null];
  }
}

export async function updateProject(
  id: string,
  data: Partial<Pick<Project, "name" | "status">>
): Promise<SupabaseServiceResult<Project>> {
  try {
    const [row] = await db
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

export async function deleteProject(id: string): Promise<SupabaseServiceResult<Project>> {
  try {
    const [row] = await db.delete(projects).where(eq(projects.id, id)).returning();

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

export async function createProjectStep(
  data: Pick<ProjectStep, "projectId" | "title" | "orderIndex">
): Promise<SupabaseServiceResult<ProjectStep>> {
  try {
    const [row] = await db.insert(projectSteps).values(data).returning();

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

export async function updateProjectStepCompletion(
  stepId: string,
  completed: boolean
): Promise<SupabaseServiceResult<ProjectStep>> {
  try {
    const [row] = await db
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

export async function reorderProjectSteps(
  projectId: string,
  steps: { id: string; orderIndex: number }[]
): Promise<SupabaseServiceResult<ProjectStep[]>> {
  try {
    const updated = await db.transaction(async (tx) => {
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

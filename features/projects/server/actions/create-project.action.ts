"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createProjectSchema, type CreateProjectFormData } from "~/features/projects/schemas/project-schema";
import { type Project } from "~/features/projects/server/db/schema";
import { createProject } from "~/features/projects/server/services/create-project.service";
import { type ActionResponse } from "~/lib/action-types";

import { logger } from "./logger";
import { mapProjectServiceError } from "./map-service-error";

export async function createProjectAction(data: CreateProjectFormData): ActionResponse<Project> {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.warn({ operation: "createProjectAction" }, "Unauthenticated access attempt");
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const parsed = createProjectSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dane formularza są nieprawidłowe",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>
    };
  }

  const [error, project] = await createProject(userId, parsed.data);
  if (error) return mapProjectServiceError(error);

  revalidatePath("/app/projects");
  return { success: true, data: project, message: "Projekt został utworzony" };
}

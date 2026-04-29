"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { projectSchema, type ProjectFormData } from "~/features/projects/schemas/project-schema";
import { createProject } from "~/features/projects/server/services/create-project.service";
import { type RedirectAction } from "~/lib/action-types";
import { setToastCookie } from "~/lib/toast/server/toast.cookie";

import { logger } from "./logger";
import { mapProjectServiceError } from "./map-service-error";

export async function createProjectAction(data: ProjectFormData): RedirectAction {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.warn({ operation: "createProjectAction" }, "Unauthenticated access attempt");
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const parsed = projectSchema.safeParse(data);
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
  await setToastCookie("Projekt został utworzony pomyślnie");
  redirect(`/app/projects/${project.id}`);
}

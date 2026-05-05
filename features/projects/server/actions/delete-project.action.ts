"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { softDeleteProject } from "~/features/projects/server/services/projects.service";
import { type RedirectAction } from "~/lib/action-types";
import { setToastCookie } from "~/lib/toast/server/toast.cookie";

import { logger } from "./logger";
import { mapProjectServiceError } from "./map-service-error";

export async function deleteProjectAction(projectId: string): RedirectAction {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.warn({ operation: "deleteProjectAction" }, "Unauthenticated access attempt");
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const [error] = await softDeleteProject({ contractorId: userId, projectId });
  if (error) return mapProjectServiceError(error);

  await setToastCookie("Projekt został usunięty");
  redirect("/app/projects");
}

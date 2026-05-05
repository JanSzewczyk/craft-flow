"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { updateProjectStatus } from "~/features/projects/server/services/projects.service";
import { type ActionResponse } from "~/lib/action-types";

import { logger } from "./logger";
import { mapProjectServiceError } from "./map-service-error";

export async function updateProjectStatusAction(
  projectId: string,
  newStatus: "ACTIVE" | "COMPLETED"
): ActionResponse<void> {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.warn({ operation: "updateProjectStatusAction" }, "Unauthenticated access attempt");
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const [error] = await updateProjectStatus({ contractorId: userId, projectId, newStatus });
  if (error) return mapProjectServiceError(error);

  revalidatePath(`/app/projects/${projectId}`);
  revalidatePath("/app/projects");

  const messages: Record<"ACTIVE" | "COMPLETED", string> = {
    ACTIVE: "Projekt został aktywowany",
    COMPLETED: "Projekt został zakończony"
  };

  return { success: true, data: undefined, message: messages[newStatus] };
}

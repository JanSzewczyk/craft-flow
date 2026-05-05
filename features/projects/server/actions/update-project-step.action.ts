"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { updateStepCompletion } from "~/features/projects/server/services/projects.service";
import { type ActionResponse } from "~/lib/action-types";

import { logger } from "./logger";
import { mapProjectServiceError } from "./map-service-error";

export async function updateStepCompletionAction(
  stepId: string,
  projectId: string,
  isCompleted: boolean
): ActionResponse<void> {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.warn({ operation: "updateStepCompletionAction" }, "Unauthenticated access attempt");
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const [error] = await updateStepCompletion({ contractorId: userId, stepId, projectId, isCompleted });
  if (error) return mapProjectServiceError(error);

  revalidatePath(`/app/projects/${projectId}`);
  return { success: true, data: undefined };
}

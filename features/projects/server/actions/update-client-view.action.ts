"use server";

// Intentionally unauthenticated — called from the public /status/[token] page.
// Fire-and-forget: errors are logged in the service and never thrown.

import { z } from "zod";

import { trackClientView } from "~/features/projects/server/services/projects.service";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "projects-actions" });

export async function updateClientViewAction(projectId: string): Promise<void> {
  const parsed = z.string().uuid().safeParse(projectId);

  if (!parsed.success) {
    logger.warn({ projectId }, "updateClientViewAction called with invalid projectId");
    return;
  }

  await trackClientView({ projectId: parsed.data });
}

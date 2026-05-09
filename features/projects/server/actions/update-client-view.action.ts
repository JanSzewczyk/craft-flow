"use server";

// Intentionally unauthenticated — called from the public /status/[token] page.
// Fire-and-forget: errors are logged in the service and never thrown.

import { z } from "zod";

import { getProjectByPublicToken } from "~/features/projects/server/db/queries";
import { trackClientView } from "~/features/projects/server/services/projects.service";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "projects-actions" });

export async function updateClientViewAction(token: string): Promise<void> {
  const parsed = z.string().min(1).safeParse(token);

  if (!parsed.success) {
    logger.warn({ token }, "updateClientViewAction called with invalid token");
    return;
  }

  const [err, project] = await getProjectByPublicToken({ token: parsed.data });
  if (err) return;

  await trackClientView({ projectId: project.id });
}

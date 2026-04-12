import { Badge } from "@szum-tech/design-system";
import { getCachedProjectStatusCounts } from "~/features/projects/server/services/projects-list.service";
import { type ProjectStatusFilter } from "~/features/projects/types/project-filter";
import logger from "~/lib/logger";

type TabCountProps = {
  userId: string;
  status: ProjectStatusFilter;
};

export async function TabCount({ userId, status }: TabCountProps) {
  const [error, counts] = await getCachedProjectStatusCounts(userId);
  if (error) {
    logger.error({ userId, errorCode: error.code }, "Failed to load project status counts");
    return null;
  }

  const count = counts[status];
  if (!count) return null;
  return <Badge variant="secondary">{count}</Badge>;
}

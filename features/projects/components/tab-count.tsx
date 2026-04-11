import { Badge } from "@szum-tech/design-system";

import { getCachedProjectStatusCounts } from "~/features/projects/server/services/projects-list.service";
import logger from "~/lib/logger";
import { ProjectStatusFilter } from "~/features/projects/types/project-filter";

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

  console.log("Counts", counts);
  const count = counts[status];
  if (!count) return null;
  return <Badge variant="secondary">{count}</Badge>;
}

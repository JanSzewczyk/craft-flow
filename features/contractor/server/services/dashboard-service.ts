import { cache } from "react";

import { createLogger } from "~/lib/logger";
import { type SupabaseServiceResult } from "~/lib/supabase/errors";
import { type PlanId } from "~/features/billing/constants";
import { detectClerkPlan, getPlanById, getProjectLimit } from "~/features/billing/server";
import { getCachedContractorProfile, type ContractorProfile } from "~/features/contractor/server/db";
import {
  getCachedActiveProjectsCount,
  getCachedCompletedProjectsThisMonth,
  getCachedRecentActivity,
  type RecentActivityItem
} from "~/features/contractor/server/db/dashboard";

const logger = createLogger({ module: "contractor-dashboard-service" });

export type DashboardData = {
  contractor: ContractorProfile;
  planId: PlanId | null;
  planName: string;
  activeProjectsCount: number;
  completedThisMonth: number;
  projectLimit: number | null;
  recentActivity: RecentActivityItem[];
};

async function _getDashboardData(userId: string): Promise<SupabaseServiceResult<DashboardData>> {
  const [profileError, contractor] = await getCachedContractorProfile(userId);

  if (profileError) {
    logger.error(
      { userId, errorCode: profileError.code, isRetryable: profileError.isRetryable },
      "Failed to load contractor profile for dashboard"
    );
    return [profileError, null];
  }

  const [planId, activeProjectsResult, completedThisMonthResult, recentActivityResult] = await Promise.all([
    detectClerkPlan(),
    getCachedActiveProjectsCount(userId),
    getCachedCompletedProjectsThisMonth(userId),
    getCachedRecentActivity(userId)
  ]);

  const plan = planId ? getPlanById(planId) : undefined;
  const projectLimit = planId ? getProjectLimit(planId) : null;

  const [activeProjectsError, activeProjectsCount] = activeProjectsResult;
  if (activeProjectsError) {
    logger.warn(
      { userId, errorCode: activeProjectsError.code, isRetryable: activeProjectsError.isRetryable },
      "Failed to get active projects count, using default"
    );
  }

  const [completedThisMonthError, completedThisMonth] = completedThisMonthResult;
  if (completedThisMonthError) {
    logger.warn(
      { userId, errorCode: completedThisMonthError.code, isRetryable: completedThisMonthError.isRetryable },
      "Failed to get completed projects this month, using default"
    );
  }

  const [recentActivityError, recentActivity] = recentActivityResult;
  if (recentActivityError) {
    logger.warn(
      { userId, errorCode: recentActivityError.code, isRetryable: recentActivityError.isRetryable },
      "Failed to get recent activity, using default"
    );
  }

  return [
    null,
    {
      contractor,
      planId,
      planName: plan?.name ?? "Brak planu",
      activeProjectsCount: activeProjectsCount ?? 0,
      completedThisMonth: completedThisMonth ?? 0,
      projectLimit,
      recentActivity: recentActivity ?? []
    }
  ];
}

export const getDashboardData = cache(_getDashboardData);

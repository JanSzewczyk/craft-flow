import { cache } from "react";

import { type LucideIcon, CheckCircleIcon, FolderOpenIcon } from "lucide-react";

import { type PlanId } from "~/features/billing/constants";
import { detectClerkPlan, getBillingPeriodStart, getPlanById, getPlanFeatures } from "~/features/billing/server";
import { getContractorProfile } from "~/features/contractor/server/db/contractor-profile/queries";
import { type ContractorProfile } from "~/features/contractor/server/db/contractor-profile/schema";
import {
  getCachedActiveProjectsCount,
  getCachedCompletedProjectsThisMonth,
  getCachedRecentActivity,
  type RecentActivityItem
} from "~/features/contractor/server/db/dashboard";
import { getProjectCountCreatedSince } from "~/features/projects/server/db";
import { createLogger } from "~/lib/logger";
import { type SupabaseServiceResult } from "~/lib/supabase/errors";

const logger = createLogger({ module: "contractor-dashboard-service" });

export type DashboardKpiCard = {
  id: string;
  title: string;
  value: string | number;
  variant: "default" | "warning";
  icon: LucideIcon;
};

export type DashboardData = {
  header: {
    contractor: ContractorProfile;
  };
  planLimit: {
    planId: PlanId | null;
    planName: string;
    activeProjectsCount: number;
    projectLimit: number | null;
  };
  recentActivity: RecentActivityItem[];
};

async function _getDashboardData(userId: string): Promise<SupabaseServiceResult<DashboardData>> {
  const [profileError, contractor] = await getContractorProfile({ contractorId: userId });

  if (profileError) {
    logger.error(
      { userId, errorCode: profileError.code, isRetryable: profileError.isRetryable },
      "Failed to load contractor profile for dashboard"
    );
    return [profileError, null];
  }

  const periodStart = await getBillingPeriodStart(userId);

  const [planId, projectsCountResult, recentActivityResult] = await Promise.all([
    detectClerkPlan(),
    getProjectCountCreatedSince({ contractorId: userId, since: periodStart }),
    getCachedRecentActivity({ contractorId: userId })
  ]);

  const plan = planId ? getPlanById(planId) : undefined;
  const {
    limitations: { projectsPerMonth: projectLimit }
  } = await getPlanFeatures();

  const [projectsCountError, projectsCount] = projectsCountResult;
  if (projectsCountError) {
    logger.warn(
      { userId, errorCode: projectsCountError.code, isRetryable: projectsCountError.isRetryable },
      "Failed to get projects count, using default"
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
      header: { contractor },
      planLimit: {
        planId,
        planName: plan?.name ?? "Brak planu",
        activeProjectsCount: projectsCount ?? 0,
        projectLimit
      },
      recentActivity: recentActivity ?? []
    }
  ];
}

export const getDashboardData = cache(_getDashboardData);

async function _getDashboardKpiCards(userId: string): Promise<SupabaseServiceResult<DashboardKpiCard[]>> {
  const [activeProjectsResult, completedThisMonthResult] = await Promise.all([
    getCachedActiveProjectsCount({ contractorId: userId }),
    getCachedCompletedProjectsThisMonth({ contractorId: userId })
  ]);

  const [, activeProjectsCount] = activeProjectsResult;
  const [, completedThisMonth] = completedThisMonthResult;

  return [
    null,
    [
      {
        id: "active-projects",
        title: "Aktywne projekty",
        value: activeProjectsCount ?? 0,
        variant: "default",
        icon: FolderOpenIcon
      },
      {
        id: "completed-this-month",
        title: "Ukończone w tym miesiącu",
        value: completedThisMonth ?? 0,
        variant: "default",
        icon: CheckCircleIcon
      }
    ]
  ];
}

export const getDashboardKpiCards = cache(_getDashboardKpiCards);

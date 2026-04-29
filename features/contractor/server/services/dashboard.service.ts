import { cache } from "react";

import { type LucideIcon, CheckCircleIcon, FolderOpenIcon, HardHatIcon } from "lucide-react";

import { type PlanId } from "~/features/billing/constants";
import { detectClerkPlan, getPlanById, getPlanFeatures } from "~/features/billing/server";
import { getContractorProfile } from "~/features/contractor/server/db/contractor-profile/queries";
import { type ContractorProfile } from "~/features/contractor/server/db/contractor-profile/schema";
import {
  getCachedActiveProjectsCount,
  getCachedCompletedProjectsThisMonth,
  getCachedRecentActivity,
  type RecentActivityItem
} from "~/features/contractor/server/db/dashboard";
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

  const [planId, activeProjectsResult, recentActivityResult] = await Promise.all([
    detectClerkPlan(),
    getCachedActiveProjectsCount({ contractorId: userId }),
    getCachedRecentActivity({ contractorId: userId })
  ]);

  const plan = planId ? getPlanById(planId) : undefined;
  const {
    limitations: { projectsPerMonth: projectLimit }
  } = await getPlanFeatures();

  const [activeProjectsError, activeProjectsCount] = activeProjectsResult;
  if (activeProjectsError) {
    logger.warn(
      { userId, errorCode: activeProjectsError.code, isRetryable: activeProjectsError.isRetryable },
      "Failed to get active projects count, using default"
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
        activeProjectsCount: activeProjectsCount ?? 0,
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

  const {
    limitations: { projectsPerMonth: projectLimit }
  } = await getPlanFeatures();
  const [, activeProjectsCount] = activeProjectsResult;
  const [, completedThisMonth] = completedThisMonthResult;

  const active = activeProjectsCount ?? 0;
  const completed = completedThisMonth ?? 0;
  const isNearLimit = projectLimit !== null && active / projectLimit >= 0.8;

  return [
    null,
    [
      { id: "active-projects", title: "Aktywne projekty", value: active, variant: "default", icon: FolderOpenIcon },
      {
        id: "completed-this-month",
        title: "Ukończone w tym miesiącu",
        value: completed,
        variant: "default",
        icon: CheckCircleIcon
      },
      {
        id: "project-limit",
        title: "Limit projektów",
        value: projectLimit === null ? "\u221E" : `${active}/${projectLimit}`,
        variant: isNearLimit ? "warning" : "default",
        icon: HardHatIcon
      }
    ]
  ];
}

export const getDashboardKpiCards = cache(_getDashboardKpiCards);

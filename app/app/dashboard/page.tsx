import Link from "next/link";
import { type Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";
import { CheckCircleIcon, FolderOpenIcon, HardHatIcon } from "lucide-react";

import { Button } from "@szum-tech/design-system";

import { createLogger } from "~/lib/logger";
import { getDashboardData } from "~/features/contractor/server/services/dashboard-service";
import { KpiCard } from "~/features/contractor/components/kpi-card";
import { PlanLimitWidget } from "~/features/contractor/components/plan-limit-widget";
import { RecentActivityList } from "~/features/contractor/components/recent-activity-list";

export const metadata: Metadata = {
  title: "Panel sterowania"
};

const logger = createLogger({ module: "dashboard-page" });

async function loadData() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  logger.info({ userId }, "Loading dashboard page data");

  const [error, data] = await getDashboardData(userId);

  if (error) {
    logger.error({ userId, errorCode: error.code, isRetryable: error.isRetryable }, "Failed to load dashboard data");
    throw error;
  }

  logger.info(
    { userId, planId: data.planId, activeProjectsCount: data.activeProjectsCount },
    "Successfully loaded dashboard page data"
  );

  return data;
}

export default async function DashboardPage() {
  const { contractor, planId, planName, activeProjectsCount, completedThisMonth, projectLimit, recentActivity } =
    await loadData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Panel sterowania</h1>
          <p className="text-muted-foreground text-sm">Witaj, {contractor.companyName}</p>
        </div>
        <Button asChild>
          <Link href="/app/projects/new">
            <HardHatIcon className="mr-2 size-4" aria-hidden="true" />
            Nowy projekt
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard title="Aktywne projekty" value={activeProjectsCount} icon={FolderOpenIcon} />
        <KpiCard title="Ukończone w tym miesiącu" value={completedThisMonth} icon={CheckCircleIcon} />
        <KpiCard
          title="Limit projektów"
          value={projectLimit === null ? "\u221E" : `${activeProjectsCount}/${projectLimit}`}
          icon={HardHatIcon}
          variant={projectLimit !== null && activeProjectsCount / projectLimit >= 0.8 ? "warning" : "default"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <RecentActivityList items={recentActivity} />
        <PlanLimitWidget
          planId={planId}
          planName={planName}
          activeProjectsCount={activeProjectsCount}
          projectLimit={projectLimit}
        />
      </div>
    </div>
  );
}

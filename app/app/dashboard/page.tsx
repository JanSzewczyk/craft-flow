import { HardHatIcon } from "lucide-react";
import { type Metadata } from "next";

import { auth } from "@clerk/nextjs/server";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, Button } from "@szum-tech/design-system";
import Link from "next/link";
import { redirect } from "next/navigation";
import { KpiCard } from "~/features/contractor/components/kpi-card";
import { PlanLimitWidget } from "~/features/contractor/components/plan-limit-widget";
import { RecentActivityList } from "~/features/contractor/components/recent-activity-list";
import { getDashboardData, getDashboardKpiCards } from "~/features/contractor/server/services/dashboard.service";
import { createLogger } from "~/lib/logger";

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

  const [[dataError, data], [kpiError, kpiCards]] = await Promise.all([
    getDashboardData(userId),
    getDashboardKpiCards(userId)
  ]);

  if (dataError) {
    logger.error(
      { userId, errorCode: dataError.code, isRetryable: dataError.isRetryable },
      "Failed to load dashboard data"
    );
    throw dataError;
  }

  if (kpiError) {
    logger.error(
      { userId, errorCode: kpiError.code, isRetryable: kpiError.isRetryable },
      "Failed to load dashboard KPI cards"
    );
    throw kpiError;
  }

  logger.info(
    { userId, planId: data.planLimit.planId, activeProjectsCount: data.planLimit.activeProjectsCount },
    "Successfully loaded dashboard page data"
  );

  return { data, kpiCards };
}

export default async function DashboardPage() {
  const { data, kpiCards } = await loadData();
  const { header, planLimit, recentActivity } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Panel sterowania</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-heading-h1">Panel sterowania</h1>
          <p className="text-lead">Witaj, {header.contractor.companyName}</p>
        </div>
        <Button asChild>
          <Link href="/app/projects/new">
            <HardHatIcon className="mr-2 size-4" aria-hidden="true" />
            Nowy projekt
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {kpiCards.map((card) => (
          <KpiCard key={card.id} title={card.title} value={card.value} icon={card.icon} variant={card.variant} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <RecentActivityList items={recentActivity} />
        <PlanLimitWidget
          planId={planLimit.planId}
          planName={planLimit.planName}
          activeProjectsCount={planLimit.activeProjectsCount}
          projectLimit={planLimit.projectLimit}
        />
      </div>
    </div>
  );
}

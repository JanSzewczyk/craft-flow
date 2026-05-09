import { HardHatIcon } from "lucide-react";
import { type Metadata } from "next";

import { auth } from "@clerk/nextjs/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button
} from "@szum-tech/design-system";
import Link from "next/link";
import { redirect } from "next/navigation";
import { KpiCard, PlanLimitWidget, RecentActivityList } from "~/features/contractor/components";
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
  const {
    data: { header, planLimit, recentActivity },
    kpiCards
  } = await loadData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/app/dashboard">Craft Flow</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Panel sterowania</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-heading-h1">Panel sterowania</h1>
          <p className="text-lead">Witaj, {header.contractor.companyName}</p>
        </div>
        <Button startIcon={<HardHatIcon />} asChild>
          <Link href="/app/projects/new">Nowy projekt</Link>
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
          periodResetDate={planLimit.periodResetDate}
        />
      </div>
    </div>
  );
}

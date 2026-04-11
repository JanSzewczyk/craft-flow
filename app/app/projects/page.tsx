import { Suspense } from "react";
import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";
import { PlusIcon } from "lucide-react";

import { Button, Skeleton } from "@szum-tech/design-system";

import { createLogger } from "~/lib/logger";
import { getCachedProjectList } from "~/features/projects/server/services/projects-list.service";
import { isFilterableStatus } from "~/features/projects/types/project-filter";

import { ProjectsPagination } from "~/features/projects/components/projects-pagination";
import { ProjectsSearch } from "~/features/projects/components/projects-search";
import { ProjectsTable } from "~/features/projects/components/projects-table";
import { ProjectsTabsNav } from "~/features/projects/components/projects-tabs-nav";
import { TabCount } from "~/features/projects/components/tab-count";

export const metadata: Metadata = {
  title: "Projekty"
};

const logger = createLogger({ module: "projects-page" });

const VALID_PER_PAGE = new Set([5, 10, 20, 50]);

function parseSearchParams(raw: Record<string, string | string[] | undefined>) {
  const statusRaw = typeof raw.status === "string" ? raw.status : undefined;
  const status = statusRaw && isFilterableStatus(statusRaw) ? statusRaw : undefined;

  const search = typeof raw.search === "string" ? raw.search.trim() : "";

  const pageRaw = typeof raw.page === "string" ? Number.parseInt(raw.page, 10) : 1;
  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? pageRaw : 1;

  const perPageRaw = typeof raw.perPage === "string" ? Number.parseInt(raw.perPage, 10) : 10;
  const perPage = VALID_PER_PAGE.has(perPageRaw) ? perPageRaw : 10;

  return { status, search, page, perPage };
}

async function loadData(searchParams: PageProps<"/app/projects">["searchParams"]) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  const params = await searchParams;
  const { status, search, page, perPage } = parseSearchParams(params);

  const [error, result] = await getCachedProjectList(userId, { status, search, page, perPage });
  if (error) {
    logger.error({ userId, errorCode: error.code }, "Failed to load project list");
    throw error;
  }

  logger.info({ userId }, "Successfully loaded projects page data");
  return { userId, status, search, result };
}

export default async function ProjectsPage({ searchParams }: PageProps<"/app/projects">) {
  const { userId, status, search, result } = await loadData(searchParams);
  const activeTab = status ?? "ALL";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-h1">Projekty</h1>
          <p className="text-lead">Zarządzaj swoimi projektami</p>
        </div>
        <Button asChild startIcon={<PlusIcon />}>
          <Link href="/app/projects/new">Nowy projekt</Link>
        </Button>
      </div>

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ProjectsSearch defaultValue={search} />
        <ProjectsTabsNav
          activeTab={activeTab}
          countBadges={{
            DRAFT: (
              <Suspense fallback={<Skeleton className="size-5.5 rounded" />}>
                <TabCount userId={userId} status="DRAFT" />
              </Suspense>
            ),
            ACTIVE: (
              <Suspense fallback={<Skeleton className="size-5.5 rounded" />}>
                <TabCount userId={userId} status="ACTIVE" />
              </Suspense>
            ),
            COMPLETED: (
              <Suspense fallback={<Skeleton className="size-5.5 rounded" />}>
                <TabCount userId={userId} status="COMPLETED" />
              </Suspense>
            ),
            ARCHIVED: (
              <Suspense fallback={<Skeleton className="size-5.5 rounded" />}>
                <TabCount userId={userId} status="ARCHIVED" />
              </Suspense>
            )
          }}
        />
      </div>
      <ProjectsTable items={result.items} />
      <ProjectsPagination pagination={result.pagination} />
    </div>
  );
}

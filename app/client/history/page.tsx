import * as React from "react";

import { type Metadata } from "next";

import { auth } from "@clerk/nextjs/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@szum-tech/design-system";
import { redirect } from "next/navigation";
import { ClientProjectCard, ClientProjectsEmptyState, ClientProjectsNav } from "~/features/crm/components";
import { ProjectStatus } from "~/features/projects/types/project";
import { getClientProjects } from "~/features/projects/server/services/projects.service";
import { createLogger } from "~/lib/logger";

export const metadata: Metadata = { title: "Historia projektów" };

const logger = createLogger({ module: "client-history-page" });

async function loadData() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  const [projErr, projects] = await getClientProjects({
    userId,
    statuses: [ProjectStatus.COMPLETED, ProjectStatus.ARCHIVED]
  });
  if (projErr) {
    logger.error({ userId, errorCode: projErr.code }, "Failed to load history projects");
    throw projErr;
  }

  logger.info({ userId, projectCount: projects.length }, "Successfully loaded history projects");
  return { projects };
}

export default async function ClientHistoryPage() {
  const { projects } = await loadData();

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="text-muted-foreground">CraftFlow</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Historia projektów</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-heading-h1">Historia projektów</h1>
      </div>

      <ClientProjectsNav />

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ClientProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <ClientProjectsEmptyState context="history" />
      )}
    </div>
  );
}

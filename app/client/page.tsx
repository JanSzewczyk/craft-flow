import * as React from "react";

import { InfoIcon } from "lucide-react";
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
import { ProjectStatus } from "~/features/projects/server/db/schema";
import { getClientProjects } from "~/features/projects/server/services/projects.service";
import { createLogger } from "~/lib/logger";

export const metadata: Metadata = { title: "Moje projekty" };

const logger = createLogger({ module: "client-page" });

async function loadData() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  const [projErr, projects] = await getClientProjects({ userId, statuses: [ProjectStatus.ACTIVE] });
  if (projErr) {
    logger.error({ userId, errorCode: projErr.code }, "Failed to load active projects");
    throw projErr;
  }

  logger.info({ userId, projectCount: projects.length }, "Successfully loaded active projects");
  return { projects };
}

export default async function ClientPortalPage() {
  const { projects } = await loadData();

  return (
    <div className="flex flex-1 flex-col space-y-6">
      <div>
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="text-muted-foreground">CraftFlow</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Moje Projekty</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-heading-h1">Moje Projekty</h1>
      </div>

      <ClientProjectsNav />

      <div className="flex-1">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ClientProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <ClientProjectsEmptyState context="active" />
        )}
      </div>

      <div className="border-border flex items-start gap-3 border-t pt-6">
        <InfoIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p className="text-body-sm text-muted-foreground">
          Nowe projekty mogą być inicjowane wyłącznie przez wykonawców. Skontaktuj się bezpośrednio ze swoim fachowcem,
          aby założyć nową realizację w systemie CraftFlow.
        </p>
      </div>
    </div>
  );
}

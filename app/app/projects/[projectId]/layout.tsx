import * as React from "react";

import { auth } from "@clerk/nextjs/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@szum-tech/design-system";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ProjectDetailTabsNav, ProjectSidebar } from "~/features/projects/components";
import { deleteProjectAction } from "~/features/projects/server/actions/delete-project.action";
import { updateProjectStatusAction } from "~/features/projects/server/actions/update-project-status.action";
import { getContractorProject } from "~/features/projects/server/services/projects.service";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "project-detail-layout" });

async function loadData({ projectId }: { projectId: string }) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  const [error, project] = await getContractorProject({ contractorId: userId, projectId });
  if (error) {
    logger.error({ userId, projectId, errorCode: error.code }, "Failed to load project layout");
    notFound();
  }

  logger.info({ userId, projectId }, "Successfully loaded project layout");
  return { project };
}

export default async function ProjectDetailLayout({ children, params }: LayoutProps<"/app/projects/[projectId]">) {
  const { projectId } = await params;
  const { project } = await loadData({ projectId });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-8">
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
                <BreadcrumbLink asChild>
                  <Link href="/app/projects">Projekty</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{project.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-heading-h1">{project.name}</h1>
          {project.description ? <p className="text-lead">{project.description}</p> : null}
        </div>

        <ProjectDetailTabsNav projectId={projectId}>{children}</ProjectDetailTabsNav>
      </div>
      <aside className="lg:col-span-4">
        <div className="sticky top-24">
          <ProjectSidebar
            project={project}
            onUpdateStatusAction={updateProjectStatusAction}
            onDeleteAction={deleteProjectAction}
          />
        </div>
      </aside>
    </div>
  );
}

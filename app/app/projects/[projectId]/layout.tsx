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
import { notFound } from "next/navigation";
import { ProjectDetailTabsNav, ProjectSidebar } from "~/features/projects/components";
import { getProjectById } from "~/features/projects/server/db";

export default async function ProjectDetailLayout({ children, params }: LayoutProps<"/app/projects/[projectId]">) {
  const { userId } = await auth();
  const { projectId } = await params;

  const [error, project] = await getProjectById({ projectId });

  if (error) {
    notFound();
  }

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

        <ProjectDetailTabsNav projectId={projectId} />

        {children}
      </div>
      <aside className="lg:col-span-4">
        <div className="sticky top-24">
          <ProjectSidebar project={project} />
        </div>
      </aside>
    </div>
  );
}

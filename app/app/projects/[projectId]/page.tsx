import { type Metadata } from "next";

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
import { ProjectDetailTabsNav, ProjectProgressBar, ProjectTimeline } from "~/features/projects/components";
import { getProjectById } from "~/features/projects/server/db";

export async function generateMetadata({ params }: PageProps<"/app/projects/[projectId]">): Promise<Metadata> {
  const { projectId } = await params;
  const [, project] = await getProjectById({ projectId });
  return { title: project?.name ?? "Projekt" };
}

export default async function ProjectDetailPage({ params }: PageProps<"/app/projects/[projectId]">) {
  const { userId } = await auth();
  const { projectId } = await params;

  const [error, project] = await getProjectById({ projectId });

  if (error) {
    notFound();
  }

  const sortedSteps = [...project.steps].sort((a, b) => a.orderIndex - b.orderIndex);
  const completedSteps = sortedSteps.filter((s) => s.isCompleted).length;

  return (
    <div className="flex flex-col gap-6">
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
        {project.description && <p className="text-lead text-muted-foreground">{project.description}</p>}
      </div>

      <ProjectDetailTabsNav projectId={projectId} />

      <div className="bg-card flex flex-col gap-6 rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-heading-h3">Postęp projektu</h2>
          <ProjectProgressBar totalSteps={sortedSteps.length} completedSteps={completedSteps} />
        </div>

        <ProjectTimeline steps={project.steps} projectId={project.id} projectStatus={project.status} />
      </div>
    </div>
  );
}

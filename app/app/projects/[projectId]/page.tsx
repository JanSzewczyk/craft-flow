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
      <div className="bg-card flex flex-col gap-6 rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-heading-h3">Postęp projektu</h2>
        </div>

        <ProjectTimeline steps={project.steps} projectId={project.id} projectStatus={project.status} />
      </div>
    </div>
  );
}

import { type Metadata } from "next";

import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { ProjectTimeline } from "~/features/projects/components";
import { getContractorProject } from "~/features/projects/server/services/projects.service";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "project-detail-page" });

async function loadData({ projectId }: { projectId: string }) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  const [error, project] = await getContractorProject({ contractorId: userId, projectId });
  if (error) {
    logger.error({ userId, projectId, errorCode: error.code }, "Failed to load project detail");
    notFound();
  }

  logger.info({ userId, projectId }, "Successfully loaded project detail");
  return { project };
}

export async function generateMetadata({ params }: PageProps<"/app/projects/[projectId]">): Promise<Metadata> {
  const { projectId } = await params;
  const { userId } = await auth();
  if (!userId) return { title: "Projekt" };

  const [, project] = await getContractorProject({ contractorId: userId, projectId });
  return { title: project?.name ?? "Projekt" };
}

export default async function ProjectDetailPage({ params }: PageProps<"/app/projects/[projectId]">) {
  const { projectId } = await params;
  const { project } = await loadData({ projectId });

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

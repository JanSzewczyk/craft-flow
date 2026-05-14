import { InfoIcon } from "lucide-react";
import { type Metadata } from "next";

import { auth } from "@clerk/nextjs/server";
import { Alert, AlertDescription, AlertTitle } from "@szum-tech/design-system";
import { notFound, redirect } from "next/navigation";
import { ProjectTimeline } from "~/features/projects/components";
import { updateStepCompletionAction } from "~/features/projects/server/actions/update-project-step.action";
import { ProjectStatus } from "~/features/projects/types/project";
import { getContractorProject, isProjectActivationAtLimit } from "~/features/projects/server/services/projects.service";
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

  const atLimit = project.status === ProjectStatus.DRAFT ? await isProjectActivationAtLimit(userId) : false;

  logger.info({ userId, projectId }, "Successfully loaded project detail");
  return { project, atLimit };
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
  const { project, atLimit } = await loadData({ projectId });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-h3">Postęp projektu</h2>
      </div>

      {project.status === ProjectStatus.DRAFT ? (
        atLimit ? (
          <Alert>
            <InfoIcon className="size-4" />
            <AlertTitle>Osiągnąłeś limit aktywnych projektów w tym okresie planu</AlertTitle>
            <AlertDescription>
              Ten projekt pozostanie w stanie szkicu. Uruchomienie będzie możliwe w nowym okresie rozliczeniowym.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <InfoIcon className="size-4" />
            <AlertTitle>Projekt nie został jeszcze aktywowany</AlertTitle>
            <AlertDescription>
              Po kliknięciu przycisku &quot;Aktywuj projekt&quot; pierwszy etap zostanie automatycznie uruchomiony.
            </AlertDescription>
          </Alert>
        )
      ) : null}

      <ProjectTimeline project={project} onUpdateStepAction={updateStepCompletionAction} />
    </div>
  );
}

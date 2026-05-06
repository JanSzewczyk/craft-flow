import { FolderOpenIcon } from "lucide-react";
import { type Metadata } from "next";

import { auth } from "@clerk/nextjs/server";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@szum-tech/design-system";
import { notFound, redirect } from "next/navigation";
import { getContractorProject } from "~/features/projects/server/services/projects.service";
import { createLogger } from "~/lib/logger";

export const metadata: Metadata = {
  title: "Pliki projektu"
};

const logger = createLogger({ module: "project-files-page" });

async function loadData({ projectId }: { projectId: string }) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  const [error] = await getContractorProject({ contractorId: userId, projectId });
  if (error) {
    logger.error({ userId, projectId, errorCode: error.code }, "Failed to load project files page");
    notFound();
  }

  logger.info({ userId, projectId }, "Successfully loaded project files page");
}

export default async function ProjectFilesPage({ params }: PageProps<"/app/projects/[projectId]/files">) {
  const { projectId } = await params;
  await loadData({ projectId });

  return (
    <Empty border="dashed">
      <EmptyMedia variant="icon">
        <FolderOpenIcon aria-hidden="true" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>Funkcja wkrótce dostępna</EmptyTitle>
        <EmptyDescription>
          Zarządzanie plikami i załącznikami do etapów projektu jest w trakcie implementacji.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

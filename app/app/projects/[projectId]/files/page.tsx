import { type Metadata } from "next";
import { FolderOpenIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@szum-tech/design-system";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getProjectById } from "~/features/projects/server/db";
import { ProjectDetailTabsNav } from "~/features/projects/components";

export const metadata: Metadata = {
  title: "Pliki projektu"
};

export default async function ProjectFilesPage({ params }: PageProps<"/app/projects/[projectId]/files">) {
  const { userId } = await auth();
  const { projectId } = await params;

  const [error, project] = await getProjectById({ projectId });

  if (error) {
    notFound();
  }

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
              <BreadcrumbLink asChild>
                <Link href={`/app/projects/${project.id}`}>{project.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Pliki</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-heading-h1">{project.name}</h1>
      </div>

      <ProjectDetailTabsNav projectId={project.id} />

      <div className="bg-card flex flex-col items-center justify-center rounded-xl border border-dashed p-16 text-center">
        <FolderOpenIcon className="text-muted-foreground/40 mb-4 h-12 w-12" />
        <h2 className="text-heading-h3 mb-1">Funkcja wkrótce dostępna</h2>
        <p className="text-muted-foreground max-w-sm text-sm">
          Zarządzanie plikami i załącznikami do etapów projektu jest w trakcie implementacji.
        </p>
      </div>
    </div>
  );
}

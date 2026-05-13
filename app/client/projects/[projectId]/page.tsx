import * as React from "react";

import { CalendarCheckIcon, CalendarIcon, MailIcon, PhoneIcon } from "lucide-react";
import { type Metadata } from "next";

import { auth } from "@clerk/nextjs/server";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  Separator
} from "@szum-tech/design-system";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ClientProjectTimeline } from "~/features/crm/components";
import { ProjectProgressBar, ProjectStatusBadge } from "~/features/projects/components";
import { getClientProject } from "~/features/projects/server/services/projects.service";
import { createLogger } from "~/lib/logger";
import { formatDate } from "~/utils/date";

const logger = createLogger({ module: "client-project-detail-page" });

async function loadData({ projectId }: { projectId: string }) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  const [err, project] = await getClientProject({ userId, projectId });
  if (err) {
    logger.error({ userId, projectId, errorCode: err.code }, "Failed to load client project detail");
    notFound();
  }

  logger.info({ userId, projectId }, "Successfully loaded client project detail");
  return { project };
}

export async function generateMetadata({ params }: PageProps<"/client/projects/[projectId]">): Promise<Metadata> {
  const { projectId } = await params;
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated || !userId) return { title: "Projekt" };

  const [, project] = await getClientProject({ userId, projectId });
  return { title: project?.name ?? "Projekt" };
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

export default async function ClientProjectDetailPage({ params }: PageProps<"/client/projects/[projectId]">) {
  const { projectId } = await params;
  const { project } = await loadData({ projectId });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-8">
        <div>
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <span className="text-muted-foreground">CraftFlow</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/client">Moje Projekty</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{project.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-heading-h1">{project.name}</h1>
          {project.description ? <p className="text-lead mt-1">{project.description}</p> : null}
        </div>

        <div className="space-y-3">
          <h2 className="text-heading-h3">Postęp projektu</h2>
          <ProjectProgressBar totalSteps={project.totalSteps} completedSteps={project.completedSteps} />
          <p className="text-mute">
            Zakończone etapy {project.completedSteps} z {project.totalSteps}
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          <h2 className="text-heading-h3">Etapy</h2>
          <ClientProjectTimeline project={project} />
        </div>
      </div>

      <aside className="lg:col-span-4">
        <div className="sticky top-24 space-y-4">
          <Card>
            <CardContent className="pt-4">
              <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
                Informacje o projekcie
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-body-sm">Status</span>
                  <ProjectStatusBadge status={project.status} />
                </div>

                {project.startedAt ? (
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-muted-foreground flex items-center gap-1.5">
                      <CalendarIcon className="size-3.5 shrink-0" aria-hidden="true" />
                      <span className="text-body-sm">Data rozpoczęcia</span>
                    </div>
                    <time className="text-body-sm font-medium" dateTime={project.startedAt.toISOString()}>
                      {formatDate(project.startedAt)}
                    </time>
                  </div>
                ) : null}

                {project.completedAt ? (
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-muted-foreground flex items-center gap-1.5">
                      <CalendarCheckIcon className="size-3.5 shrink-0" aria-hidden="true" />
                      <span className="text-body-sm">Data zakończenia</span>
                    </div>
                    <time className="text-body-sm font-medium" dateTime={project.completedAt.toISOString()}>
                      {formatDate(project.completedAt)}
                    </time>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <p className="text-muted-foreground mb-4 text-xs font-medium tracking-wide uppercase">Wykonawca</p>

              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  {project.contractorLogoUrl ? (
                    <AvatarImage src={project.contractorLogoUrl} alt={project.contractorCompanyName} />
                  ) : null}
                  <AvatarFallback>{getInitials(project.contractorCompanyName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-body-sm font-semibold">{project.contractorCompanyName}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex flex-row justify-end gap-2">
                {project.contractorPhone ? (
                  <Button asChild variant="outline" size="sm" startIcon={<PhoneIcon />}>
                    <a href={`tel:${project.contractorPhone}`}>Zadzwoń</a>
                  </Button>
                ) : null}
                <Button asChild variant="outline" size="sm" startIcon={<MailIcon />}>
                  <a href={`mailto:${project.contractorEmail}`}>Napisz</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </aside>
    </div>
  );
}

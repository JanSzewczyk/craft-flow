"use client";

import { useTransition } from "react";

import { CheckIcon, CopyIcon, LinkIcon, Loader2Icon, PlayIcon, Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator
} from "@szum-tech/design-system";
import { deleteProjectAction } from "~/features/projects/server/actions/delete-project.action";
import { updateProjectStatusAction } from "~/features/projects/server/actions/update-project-status.action";
import { type Project, type ProjectStatus } from "~/features/projects/server/db/schema";

import { ProjectProgressBar } from "./project-progress-bar";
import { ProjectStatusBadge } from "./project-status-badge";

type ProjectSidebarProps = {
  project: Project;
};

function formatDate(date: Date | null): string {
  if (!date) return "Nigdy";
  return date.toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

function ProjectSidebarActions({ project }: { project: Project }) {
  const [isPending, startTransition] = useTransition();

  const status = project.status as ProjectStatus;
  const isDraft = status === "DRAFT";
  const isActive = status === "ACTIVE";
  const hasPublicLink = isActive || status === "COMPLETED";

  function handleCopyLink() {
    const url = `${window.location.origin}/status/${project.publicToken}`;
    void navigator.clipboard.writeText(url);
  }

  function handleActivate() {
    startTransition(async () => {
      await updateProjectStatusAction(project.id, "ACTIVE");
    });
  }

  function handleComplete() {
    startTransition(async () => {
      await updateProjectStatusAction(project.id, "COMPLETED");
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteProjectAction(project.id);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {isDraft && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full"
              startIcon={isPending ? <Loader2Icon className="animate-spin" /> : <PlayIcon />}
              disabled={isPending}
            >
              Aktywuj projekt
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Aktywować projekt?</AlertDialogTitle>
              <AlertDialogDescription>
                Klient otrzyma powiadomienie e-mail z linkiem do projektu. Po aktywacji nie będzie można usunąć
                projektu.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Anuluj</AlertDialogCancel>
              <AlertDialogAction onClick={handleActivate}>Aktywuj</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {isActive && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full"
              variant="secondary"
              startIcon={isPending ? <Loader2Icon className="animate-spin" /> : <CheckIcon />}
              disabled={isPending}
            >
              Zakończ projekt
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Zakończyć projekt?</AlertDialogTitle>
              <AlertDialogDescription>
                Projekt zostanie oznaczony jako zakończony. Etapy będą zablokowane przed dalszą edycją.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Anuluj</AlertDialogCancel>
              <AlertDialogAction onClick={handleComplete}>Zakończ</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {hasPublicLink && (
        <Button className="w-full" variant="outline" startIcon={<LinkIcon />} onClick={handleCopyLink}>
          <span className="flex items-center gap-2">
            <CopyIcon className="h-3.5 w-3.5" />
            Kopiuj link dla klienta
          </span>
        </Button>
      )}

      {isDraft && (
        <>
          <Separator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full" variant="error" startIcon={<Trash2Icon />} disabled={isPending}>
                Usuń projekt
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Usunąć projekt?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tej operacji nie można cofnąć. Wszystkie dane projektu zostaną trwale usunięte.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anuluj</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Usuń</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}

export function ProjectSidebar({ project }: ProjectSidebarProps) {
  const { client, steps } = project;
  const completedSteps = steps.filter((s) => s.isCompleted).length;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">Klient</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
              {getInitials(client.name)}
            </div>
            <div className="min-w-0">
              <p className="text-foreground truncate font-medium">{client.name}</p>
              <p className="text-muted-foreground truncate text-sm">{client.email}</p>
              {client.phone && <p className="text-muted-foreground truncate text-sm">{client.phone}</p>}
            </div>
          </div>

          <div className="bg-muted flex items-center gap-2 rounded-lg px-3 py-2 text-sm">
            <span className="text-muted-foreground">Ostatnio oglądał:</span>
            <span className="font-medium">{formatDate(project.lastClientViewAt)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Status projektu
            </CardTitle>
            <ProjectStatusBadge status={project.status} />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ProjectProgressBar totalSteps={steps.length} completedSteps={completedSteps} />

          <p className="text-muted-foreground text-xs">
            Utworzono:{" "}
            {project.createdAt.toLocaleDateString("pl-PL", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">Akcje</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectSidebarActions project={project} />
        </CardContent>
      </Card>
    </div>
  );
}

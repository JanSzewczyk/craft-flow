"use client";

import { useState, useTransition } from "react";

import {
  CalendarIcon,
  CheckIcon,
  CopyIcon,
  EyeIcon,
  LinkIcon,
  Loader2Icon,
  MailIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  PlayIcon,
  RefreshCwIcon,
  Trash2Icon
} from "lucide-react";

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
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator
} from "@szum-tech/design-system";
import { type Project, ProjectStatus } from "~/features/projects/server/db/schema";
import { type ActionResponse, type RedirectAction } from "~/lib/action-types";
import { formatRelativeTime } from "~/utils/date";
import { getInitials } from "~/utils/users";

import { ProjectProgressBar } from "./project-progress-bar";
import { ProjectStatusBadge } from "./project-status-badge";

export type ProjectSidebarProps = {
  project: Project;
  onUpdateStatusAction(
    projectId: string,
    newStatus: typeof ProjectStatus.ACTIVE | typeof ProjectStatus.COMPLETED
  ): ActionResponse<void>;
  onDeleteAction(projectId: string): RedirectAction;
};

function formatDate(date: Date | null): string {
  if (!date) return "Nigdy";
  return formatRelativeTime(date);
}

export function ProjectSidebar({ project, onUpdateStatusAction, onDeleteAction }: ProjectSidebarProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { client, steps } = project;
  const completedSteps = steps.filter((s) => s.isCompleted).length;

  const status = project.status;
  const isDraft = status === ProjectStatus.DRAFT;
  const isActive = status === ProjectStatus.ACTIVE;
  const isCompleted = status === ProjectStatus.COMPLETED;
  const showActions = isDraft || isActive || isCompleted;

  function handleCopyLink() {
    const url = `${window.location.origin}/status/${project.publicToken}`;
    void navigator.clipboard.writeText(url);
  }

  function handleActivate() {
    startTransition(async () => {
      await onUpdateStatusAction(project.id, ProjectStatus.ACTIVE);
    });
  }

  function handleComplete() {
    startTransition(async () => {
      await onUpdateStatusAction(project.id, ProjectStatus.COMPLETED);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await onDeleteAction(project.id);
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Klient</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <Avatar className="size-10 shrink-0">
              <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate font-medium">{client.name}</p>
              <a
                href={`mailto:${client.email}`}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 truncate text-sm transition-colors"
              >
                <MailIcon className="size-3.5 shrink-0" />
                {client.email}
              </a>
              {client.phone ? (
                <a
                  href={`tel:${client.phone}`}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
                >
                  <PhoneIcon className="size-3.5 shrink-0" />
                  {client.phone}
                </a>
              ) : null}
            </div>
          </div>

          <Separator />

          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <EyeIcon className="size-3.5 shrink-0" />
            <span>Ostatnio oglądał:</span>
            <span className="text-foreground font-medium">{formatDate(project.lastClientViewAt)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center justify-between gap-2">
            Status projektu
            <ProjectStatusBadge status={project.status} />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ProjectProgressBar totalSteps={steps.length} completedSteps={completedSteps} />

          <Separator />

          <div className="text-muted-foreground flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-3.5 shrink-0" />
              <span>Utworzono:</span>
              <span className="text-foreground font-medium">{formatDate(project.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCwIcon className="size-3.5 shrink-0" />
              <span>Zaktualizowano:</span>
              <span className="text-foreground font-medium">{formatDate(project.updatedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {showActions ? (
        <Card>
          <CardHeader>
            <CardTitle>Akcje</CardTitle>
          </CardHeader>
          <CardContent>
            {isDraft ? (
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="flex-1"
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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" aria-label="Więcej opcji" disabled={isPending}>
                      <MoreHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      variant="error"
                      onSelect={(e) => {
                        e.preventDefault();
                        setIsDeleteOpen(true);
                      }}
                    >
                      <Trash2Icon />
                      Usuń projekt
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
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
              </div>
            ) : null}

            {isActive ? (
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="flex-1"
                      variant="default"
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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" aria-label="Więcej opcji" disabled={isPending}>
                      <MoreHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleCopyLink}>
                      <CopyIcon />
                      Kopiuj link dla klienta
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : null}

            {isCompleted ? (
              <Button className="w-full" variant="outline" startIcon={<LinkIcon />} onClick={handleCopyLink}>
                Kopiuj link dla klienta
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

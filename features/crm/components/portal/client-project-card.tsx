import { BuildingIcon, CalendarIcon } from "lucide-react";

import { Button, Card, CardContent, Separator } from "@szum-tech/design-system";
import Link from "next/link";
import { ProjectProgressBar, ProjectStatusBadge } from "~/features/projects/components";
import { ProjectStatus } from "~/features/projects/server/db/schema";
import { type ClientProjectListItem } from "~/features/projects/server/services/projects.service";
import { formatDate } from "~/utils/date";

type ClientProjectCardProps = {
  project: ClientProjectListItem;
};

const STATUS_ACCENT: Record<string, string> = {
  [ProjectStatus.ACTIVE]: "border-l-primary",
  [ProjectStatus.COMPLETED]: "border-l-success",
  [ProjectStatus.ARCHIVED]: "border-l-border",
  [ProjectStatus.DELETED]: "border-l-error"
};

export function ClientProjectCard({ project }: ClientProjectCardProps) {
  const accentClass = STATUS_ACCENT[project.status] ?? "border-l-border";

  const dateInfo = project.completedAt
    ? { label: "Zakończono", date: project.completedAt }
    : project.startedAt
      ? { label: "Rozpoczęto", date: project.startedAt }
      : null;

  return (
    <Card className={`border-l-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${accentClass}`}>
      <CardContent className="flex h-full flex-col gap-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-heading-h4 leading-snug">{project.name}</h3>
          <div className="shrink-0">
            <ProjectStatusBadge status={project.status} />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <BuildingIcon className="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
          <span className="text-body-sm truncate">{project.contractorCompanyName}</span>
        </div>

        <Separator />

        <ProjectProgressBar totalSteps={project.totalSteps} completedSteps={project.completedSteps} />

        {dateInfo ? (
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
            <span className="text-body-xs text-muted-foreground">
              {dateInfo.label}: <time dateTime={dateInfo.date.toISOString()}>{formatDate(dateInfo.date)}</time>
            </span>
          </div>
        ) : null}

        <Button asChild variant="outline" size="sm" className="mt-auto">
          <Link href={`/client/projects/${project.id}`}>Szczegóły</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

import { FolderOpenIcon } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@szum-tech/design-system";

import type { ProjectListItem } from "~/features/projects/server/db";

import { getInitials } from "~/utils/users";

import { ProjectProgressBar } from "./project-progress-bar";
import { ProjectStatusBadge } from "./project-status-badge";

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMinutes < 1) return "Przed chwilą";
  if (diffMinutes < 60) return `${diffMinutes} min temu`;
  if (diffHours < 24) return `${diffHours} godz. temu`;
  if (diffDays < 7) return `${diffDays} dn. temu`;
  return date.toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
}

type ProjectsTableProps = {
  items: Array<ProjectListItem>;
};

export function ProjectsTable({ items }: ProjectsTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FolderOpenIcon className="text-muted-foreground mb-4 size-12" aria-hidden="true" />
        <h3 className="text-heading-h3">Brak projektów</h3>
        <p className="text-mute mt-1">Nie znaleziono projektów spełniających kryteria.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nazwa projektu</TableHead>
          <TableHead>Klient</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Postęp</TableHead>
          <TableHead className="text-right">Aktualizacja</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarFallback>{getInitials(item.clientName)}</AvatarFallback>
              </Avatar>
              {item.clientName}
            </TableCell>
            <TableCell>
              <ProjectStatusBadge status={item.status} />
            </TableCell>
            <TableCell>
              <ProjectProgressBar totalSteps={item.totalSteps} completedSteps={item.completedSteps} />
            </TableCell>
            <TableCell className="text-mute text-right">{formatRelativeTime(item.updatedAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

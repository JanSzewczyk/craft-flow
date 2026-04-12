import { FolderOpenIcon } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@szum-tech/design-system";
import { type ProjectListItem } from "~/features/projects/server/db";
import { formatRelativeTime } from "~/utils/date";
import { getInitials } from "~/utils/users";

import { ProjectProgressBar } from "./project-progress-bar";
import { ProjectStatusBadge } from "./project-status-badge";

type ProjectsTableProps = {
  items: Array<ProjectListItem>;
};

export function ProjectsTable({ items }: ProjectsTableProps) {
  if (items.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <FolderOpenIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Brak projektów</EmptyTitle>
          <EmptyDescription>Nie znaleziono projektów spełniających kryteria.</EmptyDescription>
        </EmptyHeader>
      </Empty>
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

import {
  Avatar,
  AvatarFallback,
  Badge,
  type BadgeVariant,
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@szum-tech/design-system";

import type { RecentActivityItem } from "~/features/contractor/server/db/dashboard";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Szkic",
  ACTIVE: "Aktywny",
  COMPLETED: "Zakończony",
  ARCHIVED: "Zarchiwizowany",
  DELETED: "Usunięty"
};

const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  DRAFT: "outline",
  ACTIVE: "primary",
  COMPLETED: "success",
  ARCHIVED: "secondary",
  DELETED: "error"
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

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

type RecentActivityListProps = {
  items: RecentActivityItem[];
};

export function RecentActivityList({ items }: RecentActivityListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ostatnia aktywność</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">Brak aktywności do wyświetlenia</p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.projectId} className="flex items-start gap-3">
                <Avatar className="mt-0.5 size-9">
                  <AvatarFallback className="text-xs">{getInitials(item.clientName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{item.projectName}</p>
                    <Badge variant={STATUS_VARIANTS[item.projectStatus] ?? "outline"} className="shrink-0">
                      {STATUS_LABELS[item.projectStatus] ?? item.projectStatus}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground truncate text-xs">
                    {item.clientName} &middot; {item.clientEmail}
                  </p>
                  <p className="text-muted-foreground text-xs">{formatRelativeTime(item.updatedAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

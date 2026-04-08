import { Avatar, AvatarFallback, Badge, type BadgeVariant, Card } from "@szum-tech/design-system";

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
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Ostatnia aktywność</h2>
        <button className="text-primary text-sm font-semibold hover:underline">Zobacz wszystko</button>
      </div>

      <Card className="rounded-xl p-2">
        {items.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">Brak aktywności do wyświetlenia</p>
        ) : (
          <ul className="divide-y">
            {items.map((item) => (
              <li
                key={item.projectId}
                className="group hover:bg-muted/50 flex items-center gap-6 p-6 transition-colors"
              >
                <Avatar className="size-12 shrink-0">
                  <AvatarFallback>{getInitials(item.clientName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold">{item.clientName}</p>
                  <p className="text-muted-foreground truncate text-sm">
                    Projekt: <span className="text-foreground font-medium">{item.projectName}</span>
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-muted-foreground font-mono text-xs">{formatRelativeTime(item.updatedAt)}</p>
                  <Badge variant={STATUS_VARIANTS[item.projectStatus] ?? "outline"} className="mt-1">
                    {STATUS_LABELS[item.projectStatus] ?? item.projectStatus}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}

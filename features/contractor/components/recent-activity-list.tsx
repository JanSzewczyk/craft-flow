import * as React from "react";

import {
  Avatar,
  AvatarFallback,
  Badge,
  type BadgeVariant,
  Button,
  Card,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle
} from "@szum-tech/design-system";
import Link from "next/link";
import { type RecentActivityItem } from "~/features/contractor/server/db/dashboard";
import { getInitials } from "~/utils/users";

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
      <div className="relative flex items-center justify-between">
        <h2 className="text-heading-h3">Ostatnia aktywność</h2>
        <Button variant="link" className="absolute top-0 right-0" asChild>
          <Link href="/app/projects" className="text-primary text-sm font-semibold hover:underline">
            Zobacz wszystko
          </Link>
        </Button>
      </div>

      <Card>
        {items.length === 0 ? (
          <p className="text-mute py-8 text-center">Brak aktywności do wyświetlenia</p>
        ) : (
          <ItemGroup>
            {items.map((item, index) => (
              <React.Fragment>
                <Item key={item.projectId} asChild>
                  <Link href={`/app/projects/${item.projectId}`}>
                    <ItemMedia>
                      <Avatar className="size-10">
                        <AvatarFallback>{getInitials(item.clientName)}</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemHeader>
                        <ItemTitle>{item.clientName}</ItemTitle>
                      </ItemHeader>
                      <ItemDescription>
                        Projekt: <span className="text-foreground font-medium">{item.projectName}</span>
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions className="flex-col items-end">
                      <p className="font-code text-mute">{formatRelativeTime(item.updatedAt)}</p>
                      <Badge variant={STATUS_VARIANTS[item.projectStatus] ?? "outline"}>
                        {STATUS_LABELS[item.projectStatus] ?? item.projectStatus}
                      </Badge>
                    </ItemActions>
                  </Link>
                </Item>
                {index < items.length - 1 && <ItemSeparator key={`sep-${item.projectId}`} />}
              </React.Fragment>
            ))}
          </ItemGroup>
        )}
      </Card>
    </section>
  );
}

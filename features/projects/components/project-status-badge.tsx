import { Badge, type BadgeVariant } from "@szum-tech/design-system";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Szkic",
  ACTIVE: "Aktywny",
  COMPLETED: "Zakończony",
  ARCHIVED: "Zarchiwizowany"
};

const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  DRAFT: "outline",
  ACTIVE: "primary",
  COMPLETED: "success",
  ARCHIVED: "secondary"
};

type ProjectStatusBadgeProps = {
  status: string;
};

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  return <Badge variant={STATUS_VARIANTS[status] ?? "outline"}>{STATUS_LABELS[status] ?? status}</Badge>;
}

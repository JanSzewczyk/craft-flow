import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@szum-tech/design-system";

type KpiCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "warning";
};

export function KpiCard({ title, value, icon: Icon, variant = "default" }: KpiCardProps) {
  return (
    <Card className="transition-transform hover:-translate-y-1">
      <CardHeader>
        <div
          className={`mb-2 flex size-12 shrink-0 items-center justify-center rounded-lg ${
            variant === "warning" ? "bg-error/10 text-error" : "bg-primary/10 text-primary"
          }`}
        >
          <Icon className="size-6" aria-hidden="true" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-mono text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

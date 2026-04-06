import Link from "next/link";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Progress } from "@szum-tech/design-system";

import { PlanId } from "~/features/billing/constants";

type PlanLimitWidgetProps = {
  planId: PlanId | null;
  planName: string;
  activeProjectsCount: number;
  projectLimit: number | null;
};

export function PlanLimitWidget({ planId, planName, activeProjectsCount, projectLimit }: PlanLimitWidgetProps) {
  const isUnlimited = projectLimit === null;
  const usagePercent = isUnlimited ? 0 : Math.min(Math.round((activeProjectsCount / projectLimit) * 100), 100);
  const isNearLimit = !isUnlimited && usagePercent >= 80;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Twój limit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Badge variant="secondary" className="uppercase">
          {planName}
        </Badge>

        <div>
          <p className="text-heading-h1">
            {activeProjectsCount}
            {isUnlimited ? "" : ` z ${projectLimit}`}
          </p>
          <p className="text-muted-foreground text-body-sm">
            {isUnlimited ? "Aktywne projekty (bez limitu)" : "Aktywnych projektów"}
          </p>
        </div>

        {!isUnlimited && (
          <Progress value={usagePercent} className={isNearLimit ? "[&>div]:bg-destructive" : undefined} />
        )}

        {planId !== PlanId.PREMIUM && (
          <Button variant="outline" className="w-full" asChild>
            <Link href="/app/settings">Zmień plan</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

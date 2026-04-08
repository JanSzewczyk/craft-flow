import Link from "next/link";

import { AlertTriangleIcon } from "lucide-react";

import { Button, Card, CardContent, Progress } from "@szum-tech/design-system";

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
    <aside className="space-y-4">
      <h2 className="text-xl font-bold">Twój limit</h2>

      <Card className={`rounded-xl shadow-sm ${isNearLimit ? "border-destructive/20" : ""}`}>
        <CardContent className="space-y-6 p-8">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-bold tracking-widest uppercase">{planName}</span>
            {isNearLimit && <AlertTriangleIcon className="text-destructive size-5" aria-hidden="true" />}
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-bold">
              {activeProjectsCount}
              {isUnlimited ? "" : ` z ${projectLimit}`}
            </h3>
            <p className="text-muted-foreground text-sm">
              {isUnlimited ? "aktywnych projektów (bez limitu)" : "aktywnych projektów w tym miesiącu"}
            </p>
          </div>

          {!isUnlimited && (
            <Progress value={usagePercent} className={isNearLimit ? "[&>div]:bg-destructive" : undefined} />
          )}

          {isNearLimit && (
            <p className="text-muted-foreground text-xs leading-relaxed">
              Zbliżasz się do limitu swojego planu. Ulepsz konto, aby móc prowadzić nieograniczoną liczbę projektów
              jednocześnie.
            </p>
          )}

          {planId !== PlanId.PREMIUM && (
            <Button variant="outline" className="border-primary text-primary w-full border-2" asChild>
              <Link href="/app/settings">Zmień plan</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}

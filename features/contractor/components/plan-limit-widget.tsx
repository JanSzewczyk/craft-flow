import { AlertTriangleIcon } from "lucide-react";

import { Button, Card, CardContent, Progress } from "@szum-tech/design-system";
import Link from "next/link";
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
      <h2 className="text-heading-h3">Twój limit</h2>

      <Card className={isNearLimit ? "border-warning/20" : ""}>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-heading-h4 uppercase">{planName}</span>
            {isNearLimit && <AlertTriangleIcon className="text-warning size-5" aria-hidden="true" />}
          </div>

          <div className="space-y-1">
            <h3 className="text-display-sm">
              {activeProjectsCount}
              {isUnlimited ? "" : ` z ${projectLimit}`}
            </h3>
            <p className="text-muted-foreground text-body-sm">
              {isUnlimited ? "aktywnych projektów (bez limitu)" : "aktywnych projektów w tym miesiącu"}
            </p>
          </div>

          {!isUnlimited && <Progress value={usagePercent} className={isNearLimit ? "[&>div]:bg-warning" : undefined} />}

          {isNearLimit && (
            <p className="text-small">
              Zbliżasz się do limitu swojego planu. Ulepsz konto, aby móc prowadzić nieograniczoną liczbę projektów
              jednocześnie.
            </p>
          )}

          {planId !== PlanId.PREMIUM && (
            <Button asChild>
              <Link href="/app/settings">Zmień plan</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}

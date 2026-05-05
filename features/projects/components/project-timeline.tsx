"use client";

import { useOptimistic, useTransition } from "react";

import { CheckIcon } from "lucide-react";
import { updateStepCompletionAction } from "~/features/projects/server/actions/update-project-step.action";
import { type ProjectStep, type ProjectStatus } from "~/features/projects/server/db/schema";

type ProjectTimelineProps = {
  steps: ProjectStep[];
  projectId: string;
  projectStatus: ProjectStatus;
};

export function ProjectTimeline({ steps, projectId, projectStatus }: ProjectTimelineProps) {
  const isLocked = projectStatus === "COMPLETED";
  const sorted = [...steps].sort((a, b) => a.orderIndex - b.orderIndex);

  const [optimisticSteps, updateOptimistic] = useOptimistic(
    sorted,
    (current, { stepId, isCompleted }: { stepId: string; isCompleted: boolean }) =>
      current.map((s) => (s.id === stepId ? { ...s, isCompleted } : s))
  );

  const [, startTransition] = useTransition();

  function handleToggle(step: ProjectStep) {
    if (isLocked) return;
    const next = !step.isCompleted;
    startTransition(async () => {
      updateOptimistic({ stepId: step.id, isCompleted: next });
      await updateStepCompletionAction(step.id, projectId, next);
    });
  }

  if (optimisticSteps.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">Brak etapów w tym projekcie</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="bg-border absolute top-10 bottom-10 left-5 w-px" />

      <ol className="flex flex-col gap-8">
        {optimisticSteps.map((step, index) => {
          const isCompleted = step.isCompleted;
          return (
            <li key={step.id} className="relative flex gap-5">
              <button
                type="button"
                onClick={() => handleToggle(step)}
                disabled={isLocked}
                aria-label={isCompleted ? "Oznacz jako nieukończone" : "Oznacz jako ukończone"}
                className={[
                  "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary",
                  isLocked && "cursor-not-allowed opacity-60"
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {isCompleted ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </button>

              <div className="flex-1 pt-1.5">
                <p
                  className={[
                    "leading-tight font-medium",
                    isCompleted ? "text-muted-foreground line-through" : "text-foreground"
                  ].join(" ")}
                >
                  {index + 1}. {step.title}
                </p>
                {isCompleted && step.completedAt && (
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Ukończono:{" "}
                    {step.completedAt.toLocaleDateString("pl-PL", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

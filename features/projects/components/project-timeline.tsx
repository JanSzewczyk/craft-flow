"use client";

import { useState, useOptimistic, useTransition } from "react";

import { ChevronDownIcon } from "lucide-react";

import {
  Badge,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineHeader,
  TimelineItem,
  TimelineTitle,
  toast
} from "@szum-tech/design-system";
import { type Project, type ProjectStep, ProjectStatus } from "~/features/projects/server/db/schema";
import { type ActionResponse, isActionSuccess } from "~/lib/action-types";
import { formatDate } from "~/utils/date";

type StepStatus = "completed" | "active" | "pending";

type ProjectTimelineProps = {
  project: Project;
  onUpdateStepAction(stepId: string, projectId: string, isCompleted: boolean): ActionResponse<void>;
};

function getStepStatus(index: number, activeIndex: number): StepStatus {
  if (index < activeIndex) return "completed";
  if (index === activeIndex) return "active";
  return "pending";
}

const badgeVariantByStatus: Record<StepStatus, "success" | "primary" | "secondary"> = {
  completed: "success",
  active: "primary",
  pending: "secondary"
};

const badgeLabelByStatus: Record<StepStatus, string> = {
  completed: "Ukończono",
  active: "W trakcie",
  pending: "Oczekuje"
};

export function ProjectTimeline({ project, onUpdateStepAction }: ProjectTimelineProps) {
  const isLocked = project.status === ProjectStatus.COMPLETED;
  const sorted = [...project.steps].sort((a, b) => a.orderIndex - b.orderIndex);

  const [optimisticSteps, updateOptimistic] = useOptimistic(
    sorted,
    (current, { stepId, isCompleted }: { stepId: string; isCompleted: boolean }) =>
      current.map((s) => (s.id === stepId ? { ...s, isCompleted } : s))
  );

  const [, startTransition] = useTransition();
  const [openSteps, setOpenSteps] = useState<Set<string>>(new Set());

  const activeStepIndex = optimisticSteps.findIndex((s) => !s.isCompleted);
  const activeStep = activeStepIndex >= 0 ? (optimisticSteps[activeStepIndex] ?? null) : null;

  function isStepOpen(step: ProjectStep): boolean {
    return step.id === activeStep?.id || openSteps.has(step.id);
  }

  function handleOpenChange(step: ProjectStep, open: boolean) {
    if (step.id === activeStep?.id) return;
    setOpenSteps((prev) => {
      const next = new Set(prev);
      if (open) {
        next.add(step.id);
      } else {
        next.delete(step.id);
      }
      return next;
    });
  }

  function handleComplete(step: ProjectStep) {
    startTransition(async () => {
      updateOptimistic({ stepId: step.id, isCompleted: true });
      const result = await onUpdateStepAction(step.id, project.id, true);
      if (isActionSuccess(result)) {
        toast.success("Etap został ukończony");
      } else {
        toast.error("Nie udało się ukończyć etapu", { description: result.error });
      }
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
    <Timeline activeIndex={activeStepIndex >= 0 ? activeStepIndex : optimisticSteps.length}>
      {optimisticSteps.map((step, index) => {
        const stepStatus = getStepStatus(index, activeStepIndex >= 0 ? activeStepIndex : optimisticSteps.length);
        const isOpen = isStepOpen(step);
        const isActive = step.id === activeStep?.id;

        return (
          <TimelineItem key={step.id}>
            <TimelineDot />
            <TimelineConnector />
            <Collapsible open={isOpen} onOpenChange={(open) => handleOpenChange(step, open)} className="flex-1">
              <CollapsibleTrigger asChild>
                <TimelineHeader className={isActive ? "cursor-default" : "cursor-pointer"}>
                  <TimelineTitle className="flex flex-1 items-center justify-between gap-2 text-sm">
                    <span>{step.title}</span>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant={badgeVariantByStatus[stepStatus]}>{badgeLabelByStatus[stepStatus]}</Badge>
                      {isActive ? null : (
                        <ChevronDownIcon
                          className={["size-4 shrink-0 transition-transform", isOpen ? "rotate-180" : ""].join(" ")}
                        />
                      )}
                    </div>
                  </TimelineTitle>
                </TimelineHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <TimelineContent className="">
                  {stepStatus === "completed" && step.completedAt ? (
                    <TimelineDescription>Ukończono: {formatDate(step.completedAt)}</TimelineDescription>
                  ) : null}
                  {stepStatus === "pending" ? (
                    <TimelineDescription>Oczekuje na ukończenie poprzednich etapów</TimelineDescription>
                  ) : null}
                  {isActive && !isLocked ? (
                    <Button size="sm" onClick={() => handleComplete(step)}>
                      Oznacz jako ukończone
                    </Button>
                  ) : null}
                </TimelineContent>
              </CollapsibleContent>
            </Collapsible>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}

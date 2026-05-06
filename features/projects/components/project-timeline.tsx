"use client";

import { useOptimistic, useTransition } from "react";

import {
  Badge,
  Button,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
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
  const isDraft = project.status === ProjectStatus.DRAFT;
  const isLocked = project.status === ProjectStatus.COMPLETED;
  const sorted = [...project.steps].sort((a, b) => a.orderIndex - b.orderIndex);

  const [optimisticSteps, updateOptimistic] = useOptimistic(sorted, (current, updatedStep: ProjectStep) =>
    current.map((s) => (s.id === updatedStep.id ? updatedStep : s))
  );

  const [, startTransition] = useTransition();

  const activeStepIndex = isDraft ? undefined : optimisticSteps.findIndex((s) => !s.isCompleted);
  const activeStep =
    activeStepIndex !== undefined && activeStepIndex >= 0 ? (optimisticSteps[activeStepIndex] ?? null) : null;

  function handleComplete(step: ProjectStep) {
    startTransition(async () => {
      updateOptimistic({ ...step, isCompleted: true, completedAt: new Date() });
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
      <Empty border="dashed">
        <EmptyHeader>
          <EmptyTitle>Brak etapów</EmptyTitle>
          <EmptyDescription>Ten projekt nie ma jeszcze żadnych etapów.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const resolvedActiveIndex =
    activeStepIndex !== undefined && activeStepIndex >= 0 ? activeStepIndex : optimisticSteps.length;

  return (
    <Timeline activeIndex={activeStepIndex !== undefined && activeStepIndex >= 0 ? activeStepIndex : undefined}>
      {optimisticSteps.map((step, index) => {
        const stepStatus = getStepStatus(index, resolvedActiveIndex);
        const isActive = step.id === activeStep?.id;

        return (
          <TimelineItem key={step.id} className="pb-0">
            <TimelineDot />
            <TimelineConnector />
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle className="flex flex-1 items-center justify-between gap-2">
                  <span>{step.title}</span>
                  {isDraft ? null : (
                    <Badge variant={badgeVariantByStatus[stepStatus]}>{badgeLabelByStatus[stepStatus]}</Badge>
                  )}
                </TimelineTitle>
              </TimelineHeader>
              <div className="mt-2">
                {step.description ? (
                  <TimelineDescription className="mb-2">{step.description}</TimelineDescription>
                ) : null}
                {stepStatus === "completed" && step.completedAt ? (
                  <TimelineDescription>Ukończono: {formatDate(step.completedAt)}</TimelineDescription>
                ) : null}
                {isActive && !isLocked ? (
                  <Button size="sm" className="mt-2" onClick={() => handleComplete(step)}>
                    Oznacz jako ukończone
                  </Button>
                ) : null}
              </div>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}

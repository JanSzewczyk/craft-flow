import {
  Badge,
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
  TimelineTitle
} from "@szum-tech/design-system";
import { type PublicProjectView } from "~/features/projects/server/services/projects.service";
import { ProjectStatus } from "~/features/projects/server/db/schema";
import { formatDate } from "~/utils/date";

type StepStatus = "completed" | "active" | "pending";

type GuestTimelineProps = {
  project: PublicProjectView;
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

export function GuestTimeline({ project }: GuestTimelineProps) {
  const steps = project.steps;

  if (steps.length === 0) {
    return (
      <Empty border="dashed">
        <EmptyHeader>
          <EmptyTitle>Brak etapów</EmptyTitle>
          <EmptyDescription>Ten projekt nie posiada jeszcze żadnych etapów.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const isCompleted = project.status === ProjectStatus.COMPLETED;
  const activeStepIndex = steps.findIndex((s) => !s.isCompleted);
  const timelineActiveIndex = isCompleted ? steps.length : activeStepIndex >= 0 ? activeStepIndex : steps.length;
  const resolvedActiveIndex = activeStepIndex >= 0 ? activeStepIndex : steps.length;

  return (
    <Timeline activeIndex={timelineActiveIndex}>
      {steps.map((step, index) => {
        const stepStatus = getStepStatus(index, resolvedActiveIndex);

        return (
          <TimelineItem key={step.id} className="pb-0">
            <TimelineDot />
            <TimelineConnector />
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle className="flex flex-1 items-center justify-between gap-2">
                  <span>{step.title}</span>
                  <Badge variant={badgeVariantByStatus[stepStatus]}>{badgeLabelByStatus[stepStatus]}</Badge>
                </TimelineTitle>
              </TimelineHeader>
              <div className="mt-2">
                {step.description ? (
                  <TimelineDescription className="mb-1">{step.description}</TimelineDescription>
                ) : null}
                {stepStatus === "completed" && step.completedAt ? (
                  <TimelineDescription>Ukończono: {formatDate(step.completedAt)}</TimelineDescription>
                ) : null}
              </div>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}

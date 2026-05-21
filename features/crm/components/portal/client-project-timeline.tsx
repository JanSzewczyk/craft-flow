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
import { ProjectStatus, type ClientProjectDetail } from "~/features/projects/types/project";
import { formatDate } from "~/utils/date";

type StepStatus = "completed" | "active" | "pending";

type ClientProjectTimelineProps = {
  project: ClientProjectDetail;
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

export function ClientProjectTimeline({ project }: ClientProjectTimelineProps) {
  const { steps, status } = project;

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

  const sorted = [...steps].sort((a, b) => a.orderIndex - b.orderIndex);
  const isCompleted = status === ProjectStatus.COMPLETED;
  const activeStepIndex = sorted.findIndex((s) => !s.isCompleted);
  const timelineActiveIndex = isCompleted ? sorted.length : activeStepIndex >= 0 ? activeStepIndex : sorted.length;
  const resolvedActiveIndex = activeStepIndex >= 0 ? activeStepIndex : sorted.length;

  return (
    <Timeline activeIndex={timelineActiveIndex}>
      {sorted.map((step, index) => {
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

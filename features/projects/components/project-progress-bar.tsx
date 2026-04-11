import { Progress } from "@szum-tech/design-system";

type ProjectProgressBarProps = {
  totalSteps: number;
  completedSteps: number;
};

export function ProjectProgressBar({ totalSteps, completedSteps }: ProjectProgressBarProps) {
  if (totalSteps === 0) {
    return <span className="text-mute">Brak kroków</span>;
  }

  const percentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="flex items-center gap-2">
      <Progress value={percentage} className="w-20" />
      <span className="text-small font-medium">
        {completedSteps}/{totalSteps}
      </span>
    </div>
  );
}

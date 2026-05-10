import { Card, CardContent, CardHeader } from "@szum-tech/design-system";
import { ProjectProgressBar, ProjectStatusBadge } from "~/features/projects/components";
import { type ClientProjectListItem } from "~/features/projects/server/services/projects.service";

type ClientProjectCardProps = {
  project: ClientProjectListItem;
};

export function ClientProjectCard({ project }: ClientProjectCardProps) {
  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <ProjectStatusBadge status={project.status} />
        </div>
        <h3 className="text-heading-h4 mt-2 leading-tight">{project.name}</h3>
        <p className="text-body-sm text-muted-foreground">Wykonawca: {project.contractorCompanyName}</p>
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-body-sm font-medium">
            {project.completedSteps}/{project.totalSteps} etapów
          </span>
        </div>
        <ProjectProgressBar totalSteps={project.totalSteps} completedSteps={project.completedSteps} />
      </CardContent>
    </Card>
  );
}

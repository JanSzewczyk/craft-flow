import * as React from "react";

import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { ProjectSidebar } from "~/features/projects/components";
import { getProjectById } from "~/features/projects/server/db";

export default async function ProjectDetailLayout({ children, params }: LayoutProps<"/app/projects/[projectId]">) {
  const { userId } = await auth();
  const { projectId } = await params;

  const [error, project] = await getProjectById({ projectId });

  if (error || !project || project.contractorId !== userId) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8">{children}</div>
      <aside className="lg:col-span-4">
        <div className="sticky top-24">
          <ProjectSidebar project={project} />
        </div>
      </aside>
    </div>
  );
}

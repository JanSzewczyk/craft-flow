import { type Metadata } from "next";

import { auth } from "@clerk/nextjs/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@szum-tech/design-system";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCachedContractorProfile } from "~/features/contractor/server/db";
import { getClientsByContractor } from "~/features/crm/server/db";
import { CreateProjectForm } from "~/features/projects/components/create-project-form";
import { createProjectAction } from "~/features/projects/server/actions/create-project.action";
import { getTemplatesByContractor } from "~/features/templates/server/db";
import { createLogger } from "~/lib/logger";

export const metadata: Metadata = {
  title: "Nowy projekt"
};

const logger = createLogger({ module: "new-project-page" });

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  const [profileError, profile] = await getCachedContractorProfile({ contractorId: userId });
  if (profileError) {
    logger.error({ userId, errorCode: profileError.code }, "Failed to load contractor profile");
    throw profileError;
  }

  const [[templatesError, templates], [clientsError, clients]] = await Promise.all([
    getTemplatesByContractor({ contractorId: profile.id }),
    getClientsByContractor({ contractorId: profile.id })
  ]);

  if (templatesError) {
    logger.error({ userId, errorCode: templatesError.code }, "Failed to load templates");
    throw templatesError;
  }
  if (clientsError) {
    logger.error({ userId, errorCode: clientsError.code }, "Failed to load clients");
    throw clientsError;
  }

  return {
    templates,
    clients
  };
}

export default async function NewProjectPage() {
  const { templates, clients } = await loadData();

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/app/dashboard">Craft Flow</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/app/projects">Projekty</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Nowy projekt</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-heading-h1">Nowy projekt</h1>
        <p className="text-lead">Wypełnij poniższe pola, aby utworzyć szkic projektu</p>
      </div>

      <CreateProjectForm clients={clients} templates={templates} onCreateAction={createProjectAction} />
    </div>
  );
}

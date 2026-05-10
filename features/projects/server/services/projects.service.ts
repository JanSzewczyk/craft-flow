import "server-only";

import { randomBytes } from "crypto";

import * as React from "react";

import { Role } from "~/features/auth/constants/roles";
import { requireRole } from "~/features/auth/server/api/require-role";
import { getBillingPeriodStart, getPlanFeatures } from "~/features/billing/server";
import { getContractorBrandingEnabled } from "~/features/billing/server/api/get-contractor-branding-enabled";
import { getContractorProfile } from "~/features/contractor/server/db/contractor-profile/queries";
import { getOptionalClientByContractorIdAndEmail } from "~/features/crm/server/db/queries";
import {
  createClient,
  getClientsForClerkUser,
  getContractorClient
} from "~/features/crm/server/services/clients.service";
import { type ProjectFormData } from "~/features/projects/schemas/project-schema";
import {
  updateProject,
  createProjectByContractorId,
  createProjectSteps,
  updateProjectStepCompletion,
  updateProjectLastClientViewAt
} from "~/features/projects/server/db/mutations";
import {
  getProjectListByClientIds,
  getProjectById,
  getProjectByPublicToken,
  getProjectCountStartedSince,
  getProjectLastClientViewAt,
  type ClientProjectListItem
} from "~/features/projects/server/db/queries";

export type { ClientProjectListItem };
import { ProjectStatus, type Project, type ProjectRow } from "~/features/projects/server/db/schema";
import { canActivateProject } from "~/features/projects/server/permissions";
import { emailService } from "~/features/projects/server/services/email.service";
import { getTemplateById } from "~/features/templates/server/db/queries";
import { createLogger } from "~/lib/logger";
import { type ServiceResult } from "~/lib/services/errors";
import { withTransaction } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

export type PublicProjectView = {
  id: string;
  client: {
    id: string;
    name: string;
    email: string;
  };
  name: string;
  status: Extract<ProjectStatus, "ACTIVE" | "COMPLETED">;
  clientName: string;
  steps: Array<{
    id: string;
    title: string;
    description: string | null;
    isCompleted: boolean;
    completedAt: Date | null;
    createdAt: Date;
    orderIndex: number;
  }>;
  contractor: {
    companyName: string;
    brandColor: string | null;
    logoUrl: string | null;
  };
};

const logger = createLogger({ module: "project-service" });

const TRACK_CLIENT_VIEW_THROTTLE_MS = 5 * 60 * 1000;

// ---------------------------------------------------------------------------
// Public project view (unauthenticated)
// ---------------------------------------------------------------------------

export const getPublicProjectView = React.cache(async function ({
  token
}: {
  token: string;
}): Promise<SupabaseServiceResult<PublicProjectView>> {
  const [projectErr, project] = await getProjectByPublicToken({ token });
  if (projectErr) return [projectErr, null];

  const contractorId = project.contractorId;

  const [[profileErr, profile], hasBranding] = await Promise.all([
    getContractorProfile({ contractorId }),
    getContractorBrandingEnabled(contractorId)
  ]);

  if (profileErr) {
    logger.error(
      { token, contractorId, errorCode: profileErr.code },
      "Failed to get contractor profile for public project view"
    );
    return [profileErr, null];
  }

  const view: PublicProjectView = {
    id: project.id,
    client: {
      id: project.clientId,
      name: project.client.name,
      email: project.client.email
    },
    name: project.name,
    status: project.status as Extract<ProjectStatus, "ACTIVE" | "COMPLETED">,
    clientName: project.client.name,
    steps: project.steps.map((step) => ({
      id: step.id,
      title: step.title,
      description: step.description,
      isCompleted: step.isCompleted,
      completedAt: step.completedAt,
      createdAt: step.createdAt,
      orderIndex: step.orderIndex
    })),
    contractor: {
      companyName: profile.companyName,
      brandColor: hasBranding ? profile.brandColor : null,
      logoUrl: hasBranding ? profile.logoUrl : null
    }
  };

  return [null, view];
});

export async function trackClientView({ projectId }: { projectId: string }): Promise<ServiceResult<void>> {
  const [fetchErr, lastViewAt] = await getProjectLastClientViewAt({ projectId });
  if (fetchErr) return [fetchErr, null];

  const now = Date.now();
  if (lastViewAt && now - lastViewAt.getTime() < TRACK_CLIENT_VIEW_THROTTLE_MS) {
    return [null, undefined];
  }

  const [updateErr] = await updateProjectLastClientViewAt({ id: projectId });
  if (updateErr) {
    logger.error({ projectId, operation: "trackClientView", errorCode: updateErr.code }, "Failed to track client view");
    return [updateErr, null];
  }

  return [null, undefined];
}

// ---------------------------------------------------------------------------
// Read service (cached for request deduplication during render)
// ---------------------------------------------------------------------------

export const getContractorProject = React.cache(async function ({
  contractorId,
  projectId
}: {
  contractorId: string;
  projectId: string;
}): Promise<SupabaseServiceResult<Project>> {
  logger.info({ contractorId, projectId }, "Loading project detail");

  const [projectError, project] = await getProjectById({ projectId });
  if (projectError) {
    logger.error({ contractorId, projectId, errorCode: projectError.code }, "Failed to fetch project");
    return [projectError, null];
  }

  if (project.contractorId !== contractorId) {
    logger.warn(
      { contractorId, projectId, operation: "getProjectDetail" },
      "Ownership check failed: project belongs to another contractor"
    );
    return [SupabaseServiceError.unauthorized(), null];
  }

  return [null, project];
});

// ---------------------------------------------------------------------------

export async function createProject({
  contractorId,
  formData
}: {
  contractorId: string;
  formData: ProjectFormData;
}): Promise<ServiceResult<ProjectRow>> {
  logger.info({ contractorId }, "Creating project");

  const [roleErr] = await requireRole(contractorId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ contractorId, operation: "createProject", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  let clientId: string;

  if (formData.client.mode === "existing") {
    const [clientErr] = await getContractorClient({ clientId: formData.client.clientId, contractorId });
    if (clientErr) {
      logger.error(
        { contractorId, operation: "createProject", clientId: formData.client.clientId, errorCode: clientErr.code },
        "Failed to fetch client"
      );
      return [clientErr, null];
    }

    clientId = formData.client.clientId;
  } else {
    const { name, email, phone } = formData.client;

    const [err, optionalClient] = await getOptionalClientByContractorIdAndEmail({ contractorId, email });
    if (err) {
      logger.error(
        { contractorId, operation: "createProject", errorCode: err.code },
        "Failed to fetch optional client for duplicate check"
      );
      return [err, null];
    }

    const duplicate = !!optionalClient;
    if (duplicate) {
      const dupErr = SupabaseServiceError.alreadyExists("Client");
      logger.warn({ contractorId, operation: "createProject", email }, "Client with this email already exists");
      return [dupErr, null];
    }
    const [createClientErr, newClient] = await createClient({
      contractorId,
      data: { name, email, phone }
    });
    if (createClientErr) {
      logger.error(
        { contractorId, operation: "createProject", errorCode: createClientErr.code },
        "Failed to create new client"
      );
      return [createClientErr, null];
    }

    clientId = newClient.id;
  }

  const [templateErr, template] = await getTemplateById({ templateId: formData.templateId });
  if (templateErr) {
    logger.error(
      { contractorId, operation: "createProject", templateId: formData.templateId, errorCode: templateErr.code },
      "Failed to fetch template"
    );
    return [templateErr, null];
  }

  if (template.contractorId !== contractorId) {
    const ownerErr = SupabaseServiceError.unauthorized();
    logger.warn(
      { contractorId, operation: "createProject", templateId: formData.templateId },
      "Template belongs to another contractor"
    );
    return [ownerErr, null];
  }

  try {
    const project = await withTransaction(async (tx) => {
      const publicToken = randomBytes(8).toString("hex");

      const [projectErr, createdProject] = await createProjectByContractorId({
        contractorId,
        data: {
          clientId,
          name: formData.name,
          description: formData.description,
          publicToken,
          status: ProjectStatus.DRAFT
        },
        dbClient: tx
      });
      if (projectErr) throw projectErr;

      if (template.steps.length > 0) {
        const [stepsErr] = await createProjectSteps({
          projectId: createdProject.id,
          steps: template.steps.map((s) => ({ title: s.title, description: s.description, orderIndex: s.orderIndex })),
          dbClient: tx
        });
        if (stepsErr) throw stepsErr;
      }

      return createdProject;
    });

    logger.info({ contractorId, projectId: project.id }, "Project created successfully");
    return [null, project];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Project");
    logger.error(
      { contractorId, operation: "createProject", errorCode: serviceError.code },
      "Failed to create project"
    );
    return [serviceError, null];
  }
}

const VALID_STATUS_TRANSITIONS: Partial<Record<ProjectStatus, ProjectStatus>> = {
  [ProjectStatus.DRAFT]: ProjectStatus.ACTIVE,
  [ProjectStatus.ACTIVE]: ProjectStatus.COMPLETED
};

export async function updateProjectStatus({
  contractorId,
  projectId,
  newStatus
}: {
  contractorId: string;
  projectId: string;
  newStatus: Extract<ProjectStatus, "ACTIVE" | "COMPLETED">;
}): Promise<ServiceResult<void>> {
  const [roleErr] = await requireRole(contractorId, [Role.CONTRACTOR]);
  if (roleErr) return [roleErr, null];

  const [profileErr, profile] = await getContractorProfile({ contractorId });
  if (profileErr) return [profileErr, null];

  const [projectErr, project] = await getContractorProject({ contractorId, projectId });
  if (projectErr) return [projectErr, null];

  if (VALID_STATUS_TRANSITIONS[project.status] !== newStatus) {
    logger.warn(
      { contractorId, operation: "updateProjectStatus", projectId, from: project.status, to: newStatus },
      "Invalid status transition"
    );
    return [SupabaseServiceError.validation(`Niedozwolone przejście statusu: ${project.status} → ${newStatus}`), null];
  }

  if (newStatus === ProjectStatus.ACTIVE) {
    const [activateErr] = await canActivateProject(contractorId);
    if (activateErr) {
      logger.warn(
        { contractorId, operation: "updateProjectStatus", projectId, errorCode: activateErr.code },
        "Activation limit reached"
      );
      return [activateErr, null];
    }
  }

  const statusData =
    newStatus === ProjectStatus.ACTIVE
      ? { status: newStatus, startedAt: new Date() }
      : { status: newStatus, completedAt: new Date() };

  const [updateErr] = await updateProject({ id: projectId, data: statusData });
  if (updateErr) {
    logger.error(
      { contractorId, operation: "updateProjectStatus", projectId, errorCode: updateErr.code },
      "Failed to update project status"
    );
    return [updateErr, null];
  }

  if (newStatus === ProjectStatus.ACTIVE) {
    await emailService.sendProjectActivationEmail({
      contractorName: profile.companyName,
      clientEmail: project.client.email,
      clientName: project.client.name,
      projectName: project.name,
      projectPublicToken: project.publicToken
    });
  }

  logger.info({ contractorId, projectId, newStatus }, "Project status updated");
  return [null, undefined];
}

export async function updateStepCompletion({
  contractorId,
  stepId,
  projectId,
  isCompleted
}: {
  contractorId: string;
  stepId: string;
  projectId: string;
  isCompleted: boolean;
}): Promise<ServiceResult<void>> {
  const [roleErr] = await requireRole(contractorId, [Role.CONTRACTOR]);
  if (roleErr) return [roleErr, null];

  const [projectErr, project] = await getContractorProject({ contractorId, projectId });
  if (projectErr) return [projectErr, null];

  if (project.status === ProjectStatus.COMPLETED) {
    return [SupabaseServiceError.validation("Nie można edytować zakończonego projektu"), null];
  }

  const [stepErr] = await updateProjectStepCompletion({ stepId, completed: isCompleted });
  if (stepErr) {
    logger.error(
      { contractorId, operation: "updateStepCompletion", stepId, errorCode: stepErr.code },
      "Failed to update step completion"
    );
    return [stepErr, null];
  }

  logger.info({ contractorId, projectId, stepId, isCompleted }, "Step completion updated");
  return [null, undefined];
}

export async function softDeleteProject({
  contractorId,
  projectId
}: {
  contractorId: string;
  projectId: string;
}): Promise<ServiceResult<void>> {
  const [roleErr] = await requireRole(contractorId, [Role.CONTRACTOR]);
  if (roleErr) return [roleErr, null];

  const [projectErr, project] = await getContractorProject({ contractorId, projectId });
  if (projectErr) return [projectErr, null];

  if (project.status !== ProjectStatus.DRAFT) {
    return [SupabaseServiceError.validation("Usunąć można tylko projekt w stanie szkicu"), null];
  }

  const [updateErr] = await updateProject({ id: projectId, data: { status: ProjectStatus.DELETED } });
  if (updateErr) {
    logger.error(
      { contractorId, operation: "softDeleteProject", projectId, errorCode: updateErr.code },
      "Failed to soft-delete project"
    );
    return [updateErr, null];
  }

  logger.info({ contractorId, projectId }, "Project soft-deleted");
  return [null, undefined];
}

export async function getClientProjects({
  userId,
  statuses
}: {
  userId: string;
  statuses: Array<ProjectStatus>;
}): Promise<ServiceResult<Array<ClientProjectListItem>>> {
  logger.info({ userId, statuses }, "Loading client portal projects");

  const [roleErr] = await requireRole(userId, [Role.CLIENT]);
  if (roleErr) {
    logger.warn({ userId, operation: "getClientProjects", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [clientsErr, clientRecords] = await getClientsForClerkUser(userId);
  if (clientsErr) {
    logger.error(
      { userId, operation: "getClientProjects", errorCode: clientsErr.code },
      "Failed to fetch client records"
    );
    return [clientsErr, null];
  }

  if (clientRecords.length === 0) {
    logger.info({ userId }, "No client records found — returning empty project list");
    return [null, []];
  }

  const clientIds = clientRecords.map((c) => c.id);
  const [err, projects] = await getProjectListByClientIds({ clientIds, statuses });
  if (err) {
    logger.error({ userId, operation: "getClientProjects", errorCode: err.code }, "Failed to load projects");
    return [err, null];
  }

  logger.info(
    { userId, clientCount: clientRecords.length, projectCount: projects.length },
    "Successfully loaded client portal projects"
  );
  return [null, projects];
}

export async function isProjectActivationAtLimit(contractorId: string): Promise<boolean> {
  const {
    limitations: { projectsPerMonth: max }
  } = await getPlanFeatures();

  if (max === null) return false;

  const periodStart = await getBillingPeriodStart(contractorId);
  const [err, count] = await getProjectCountStartedSince({ contractorId, since: periodStart });

  if (err) return true;

  return (count ?? 0) >= max;
}

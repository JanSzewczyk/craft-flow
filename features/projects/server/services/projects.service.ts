import "server-only";

import { randomBytes } from "crypto";

import * as React from "react";

import { Role } from "~/features/auth/constants/roles";
import { requireRole } from "~/features/auth/server/api/require-role";
import { getContractorProfile } from "~/features/contractor/server/db/contractor-profile/queries";
import { getOptionalClientByContractorIdAndEmail } from "~/features/crm/server/db/queries";
import { createClient, getContractorClient } from "~/features/crm/server/services/clients.service";
import { type ProjectFormData } from "~/features/projects/schemas/project-schema";
import {
  updateProject,
  createProjectByContractorId,
  createProjectSteps,
  updateProjectStepCompletion
} from "~/features/projects/server/db/mutations";
import { getProjectById } from "~/features/projects/server/db/queries";
import { type Project, type ProjectStatus } from "~/features/projects/server/db/schema";
import { canCreateProject } from "~/features/projects/server/permissions";
import { emailService } from "~/features/projects/server/services/email.service";
import { getTemplateById } from "~/features/templates/server/db/queries";
import { createLogger } from "~/lib/logger";
import { type ServiceResult } from "~/lib/services/errors";
import { withTransaction } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

const logger = createLogger({ module: "project-service" });

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

type ProjectRow = { id: string };

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

  const [permErr] = await canCreateProject(contractorId);
  if (permErr) {
    logger.warn({ contractorId, operation: "createProject", errorCode: permErr.code }, "Permission check failed");
    return [permErr, null];
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
          status: "DRAFT"
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
  DRAFT: "ACTIVE",
  ACTIVE: "COMPLETED"
};

export async function updateProjectStatus({
  contractorId,
  projectId,
  newStatus
}: {
  contractorId: string;
  projectId: string;
  newStatus: "ACTIVE" | "COMPLETED";
}): Promise<ServiceResult<void>> {
  const [roleErr] = await requireRole(contractorId, [Role.CONTRACTOR]);
  if (roleErr) return [roleErr, null];

  const [profileErr, profile] = await getContractorProfile({ contractorId });
  if (profileErr) return [profileErr, null];

  const [projectErr, project] = await getProjectById({ projectId });
  if (projectErr) return [projectErr, null];

  if (project.contractorId !== contractorId) {
    logger.warn({ contractorId, operation: "updateProjectStatus", projectId }, "Ownership check failed");
    return [SupabaseServiceError.unauthorized(), null];
  }

  if (VALID_STATUS_TRANSITIONS[project.status] !== newStatus) {
    logger.warn(
      { contractorId, operation: "updateProjectStatus", projectId, from: project.status, to: newStatus },
      "Invalid status transition"
    );
    return [SupabaseServiceError.validation(`Niedozwolone przejście statusu: ${project.status} → ${newStatus}`), null];
  }

  const [updateErr] = await updateProject({ id: projectId, data: { status: newStatus } });
  if (updateErr) {
    logger.error(
      { contractorId, operation: "updateProjectStatus", projectId, errorCode: updateErr.code },
      "Failed to update project status"
    );
    return [updateErr, null];
  }

  if (newStatus === "ACTIVE") {
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

  const [projectErr, project] = await getProjectById({ projectId });
  if (projectErr) return [projectErr, null];

  if (project.contractorId !== contractorId) {
    logger.warn({ contractorId, operation: "updateStepCompletion", projectId }, "Ownership check failed");
    return [SupabaseServiceError.unauthorized(), null];
  }

  if (project.status === "COMPLETED") {
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

  const [projectErr, project] = await getProjectById({ projectId });
  if (projectErr) return [projectErr, null];

  if (project.contractorId !== contractorId) {
    logger.warn({ contractorId, operation: "softDeleteProject", projectId }, "Ownership check failed");
    return [SupabaseServiceError.unauthorized(), null];
  }

  if (project.status !== "DRAFT") {
    return [SupabaseServiceError.validation("Usunąć można tylko projekt w stanie szkicu"), null];
  }

  const [updateErr] = await updateProject({ id: projectId, data: { status: "DELETED" } });
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

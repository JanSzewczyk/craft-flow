import "server-only";

import { randomBytes } from "crypto";

import { Role } from "~/features/auth/constants/roles";
import { requireRole } from "~/features/auth/server/api/require-role";
import { getOptionalClientByContractorIdAndEmail } from "~/features/crm/server/db/queries";
import { createClient, getContractorClient } from "~/features/crm/server/services/clients.service";
import { type ProjectFormData } from "~/features/projects/schemas/project-schema";
import { createProjectByContractorId, createProjectSteps } from "~/features/projects/server/db/mutations";
import { canCreateProject } from "~/features/projects/server/permissions";
import { getTemplateById } from "~/features/templates/server/db/queries";
import { createLogger } from "~/lib/logger";
import { type ServiceResult } from "~/lib/services/errors";
import { withTransaction } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError } from "~/lib/supabase/errors";

const logger = createLogger({ module: "create-project-service" });

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
          steps: template.steps.map((s) => ({ title: s.title, orderIndex: s.orderIndex })),
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

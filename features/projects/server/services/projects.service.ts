import "server-only";

import { randomBytes } from "crypto";

import { clerkClient } from "@clerk/nextjs/server";
import { Role } from "~/features/auth/constants/roles";
import { requireRole } from "~/features/auth/server/api/require-role";
import { createClient } from "~/features/crm/server/db/mutations";
import { getClientById, getClientsByContractor } from "~/features/crm/server/db/queries";
import { type Client } from "~/features/crm/server/db/schema";
import { type ProjectFormData } from "~/features/projects/schemas/project-schema";
import { createProject as createProjectDb, createProjectSteps } from "~/features/projects/server/db/mutations";
import { canCreateProject } from "~/features/projects/server/permissions";
import { withTransaction } from "~/lib/supabase/db";
import { getTemplateById } from "~/features/templates/server/db/queries";
import { createLogger } from "~/lib/logger";
import { type BaseServiceError, type ServiceResult } from "~/lib/services/errors";
import { categorizeSupabaseError, SupabaseServiceError } from "~/lib/supabase/errors";

const logger = createLogger({ module: "create-project-service" });

type ProjectRow = { id: string };
export type CreateProjectResult = ServiceResult<BaseServiceError, ProjectRow>;

export async function createProject({
  contractorId,
  formData
}: {
  contractorId: string;
  formData: ProjectFormData;
}): Promise<CreateProjectResult> {
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

  if (formData.clientId) {
    const [clientErr, existingClient] = await getClientById({ id: formData.clientId });
    if (clientErr) {
      logger.error(
        { contractorId, operation: "createProject", clientId: formData.clientId, errorCode: clientErr.code },
        "Failed to fetch client"
      );
      return [clientErr, null];
    }

    if (existingClient.contractorId !== contractorId) {
      const ownerErr = SupabaseServiceError.unauthorized();
      logger.warn(
        { contractorId, operation: "createProject", clientId: formData.clientId },
        "Client belongs to another contractor"
      );
      return [ownerErr, null];
    }

    clientId = existingClient.id;
  } else {
    const { name, email, phone } = formData.newClient!;

    const [listErr, existingClients] = await getClientsByContractor({ contractorId });
    if (listErr) {
      logger.error(
        { contractorId, operation: "createProject", errorCode: listErr.code },
        "Failed to fetch client list for duplicate check"
      );
      return [listErr, null];
    }

    const duplicate = existingClients.find((c: Client) => c.email === email);
    if (duplicate) {
      const dupErr = SupabaseServiceError.alreadyExists("Client");
      logger.warn({ contractorId, operation: "createProject", email }, "Client with this email already exists");
      return [dupErr, null];
    }

    let clerkUserId: string | null = null;
    try {
      const clerk = await clerkClient();
      const users = await clerk.users.getUserList({ emailAddress: [email] });
      const foundUser = users.data[0];
      if (foundUser) {
        clerkUserId = foundUser.id;
        logger.info({ contractorId, operation: "createProject", email }, "Found existing Clerk user for new client");
      }
    } catch (_clerkErr) {
      logger.warn(
        { contractorId, operation: "createProject", email },
        "Clerk lookup failed — creating client without clerkUserId"
      );
    }

    const [createClientErr, newClient] = await createClient({
      contractorId,
      data: { name, email, phone: phone ?? null, clerkUserId }
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

  let project: { id: string };
  try {
    project = await withTransaction(async (tx) => {
      const publicToken = randomBytes(8).toString("hex");

      const [projectErr, createdProject] = await createProjectDb({
        data: {
          contractorId,
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
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "Project");
    logger.error(
      { contractorId, operation: "createProject", errorCode: serviceError.code },
      "Failed to create project"
    );
    return [serviceError, null];
  }

  logger.info({ contractorId, projectId: project.id }, "Project created successfully");
  return [null, project];
}

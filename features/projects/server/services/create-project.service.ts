import "server-only";

import { randomBytes } from "crypto";

import { clerkClient } from "@clerk/nextjs/server";
import { Role } from "~/features/auth/constants/roles";
import { requireRole } from "~/features/auth/server/api/require-role";
import { getCachedContractorProfile } from "~/features/contractor/server/db";
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

export async function createProject(userId: string, formData: ProjectFormData): Promise<CreateProjectResult> {
  logger.info({ userId }, "Creating project");

  const [roleErr] = await requireRole(userId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ userId, operation: "createProject", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [profileErr, profile] = await getCachedContractorProfile({ contractorId: userId });
  if (profileErr) {
    logger.error(
      { userId, operation: "createProject", errorCode: profileErr.code },
      "Failed to load contractor profile"
    );
    return [profileErr, null];
  }

  const [permErr] = await canCreateProject(profile.id);
  if (permErr) {
    logger.warn({ userId, operation: "createProject", errorCode: permErr.code }, "Permission check failed");
    return [permErr, null];
  }

  let clientId: string;

  if (formData.clientId) {
    const [clientErr, existingClient] = await getClientById({ id: formData.clientId });
    if (clientErr) {
      logger.error(
        { userId, operation: "createProject", clientId: formData.clientId, errorCode: clientErr.code },
        "Failed to fetch client"
      );
      return [clientErr, null];
    }

    if (existingClient.contractorId !== profile.id) {
      const ownerErr = SupabaseServiceError.unauthorized();
      logger.warn(
        { userId, operation: "createProject", clientId: formData.clientId },
        "Client belongs to another contractor"
      );
      return [ownerErr, null];
    }

    clientId = existingClient.id;
  } else {
    const { name, email, phone } = formData.newClient!;

    const [listErr, existingClients] = await getClientsByContractor({ contractorId: profile.id });
    if (listErr) {
      logger.error(
        { userId, operation: "createProject", errorCode: listErr.code },
        "Failed to fetch client list for duplicate check"
      );
      return [listErr, null];
    }

    const duplicate = existingClients.find((c: Client) => c.email === email);
    if (duplicate) {
      const dupErr = SupabaseServiceError.alreadyExists("Client");
      logger.warn({ userId, operation: "createProject", email }, "Client with this email already exists");
      return [dupErr, null];
    }

    let clerkUserId: string | null = null;
    try {
      const clerk = await clerkClient();
      const users = await clerk.users.getUserList({ emailAddress: [email] });
      const foundUser = users.data[0];
      if (foundUser) {
        clerkUserId = foundUser.id;
        logger.info({ userId, operation: "createProject", email }, "Found existing Clerk user for new client");
      }
    } catch (_clerkErr) {
      logger.warn(
        { userId, operation: "createProject", email },
        "Clerk lookup failed — creating client without clerkUserId"
      );
    }

    const [createClientErr, newClient] = await createClient({
      contractorId: profile.id,
      data: { name, email, phone: phone ?? null, clerkUserId }
    });

    if (createClientErr) {
      logger.error(
        { userId, operation: "createProject", errorCode: createClientErr.code },
        "Failed to create new client"
      );
      return [createClientErr, null];
    }

    clientId = newClient.id;
  }

  const [templateErr, template] = await getTemplateById({ templateId: formData.templateId });
  if (templateErr) {
    logger.error(
      { userId, operation: "createProject", templateId: formData.templateId, errorCode: templateErr.code },
      "Failed to fetch template"
    );
    return [templateErr, null];
  }

  if (template.contractorId !== profile.id) {
    const ownerErr = SupabaseServiceError.unauthorized();
    logger.warn(
      { userId, operation: "createProject", templateId: formData.templateId },
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
          contractorId: profile.id,
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
    logger.error({ userId, operation: "createProject", errorCode: serviceError.code }, "Failed to create project");
    return [serviceError, null];
  }

  logger.info({ userId, projectId: project.id }, "Project created successfully");
  return [null, project];
}

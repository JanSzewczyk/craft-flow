import { cache } from "react";

import { Role } from "~/features/auth/constants/roles";
import { requireRole } from "~/features/auth/server/api/require-role";
import { getPlanFeatures } from "~/features/billing/server";
import { type TemplateFormData } from "~/features/templates/schemas/template-schema";
import {
  createTemplate as createTemplateDb,
  deleteTemplate as deleteTemplateDb,
  updateTemplate as updateTemplateDb
} from "~/features/templates/server/db/mutations";
import {
  getTemplateById,
  getTemplateCountByContractor,
  getTemplateListByContractor,
  type TemplateListOptions,
  type TemplateListResult
} from "~/features/templates/server/db/queries";
import { canAddTemplate } from "~/features/templates/server/permissions";
import { createLogger } from "~/lib/logger";
import { type ServiceResult } from "~/lib/services/errors";
import { SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { type Template } from "../db/schema";

const logger = createLogger({ module: "templates-service" });

// ---------------------------------------------------------------------------
// Read service (cached for request deduplication during render)
// ---------------------------------------------------------------------------

export const getTemplateList = cache(async function ({
  contractorId,
  options
}: {
  contractorId: string;
  options: TemplateListOptions;
}): Promise<SupabaseServiceResult<TemplateListResult>> {
  logger.info({ contractorId, ...options }, "Loading template list");

  return getTemplateListByContractor({ contractorId, options });
});

export type TemplateLimits = {
  used: number;
  max: number | null;
};

export const getTemplateLimits = cache(async function ({
  contractorId
}: {
  contractorId: string;
}): Promise<SupabaseServiceResult<TemplateLimits>> {
  logger.info({ contractorId }, "Loading template limits");

  const [countError, used] = await getTemplateCountByContractor({ contractorId });
  if (countError) {
    logger.error({ contractorId, errorCode: countError.code }, "Failed to count templates");
    return [countError, null];
  }

  const {
    limitations: { templates: max }
  } = await getPlanFeatures();

  return [null, { used, max }];
});

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

async function checkOwnership(templateId: string, contractorId: string): Promise<SupabaseServiceResult<Template>> {
  const [err, existing] = await getTemplateById({ templateId });
  if (err) {
    logger.error({ templateId, operation: "checkOwnership", errorCode: err.code }, "Failed to fetch template");
    return [err, null];
  }

  if (existing.contractorId !== contractorId) {
    logger.warn(
      { templateId, contractorId, operation: "checkOwnership" },
      "Ownership check failed: template belongs to another contractor"
    );
    return [SupabaseServiceError.unauthorized(), null];
  }

  return [null, existing];
}

// ---------------------------------------------------------------------------
// Mutation service
// ---------------------------------------------------------------------------

export type TemplateMutationResult<T> = ServiceResult<T>;

export async function createTemplate({
  contractorId,
  formData
}: {
  contractorId: string;
  formData: TemplateFormData;
}): Promise<TemplateMutationResult<Template>> {
  logger.info({ contractorId }, "Creating template");

  const [roleErr] = await requireRole(contractorId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ contractorId, operation: "createTemplate", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [limitsErr] = await canAddTemplate(contractorId);
  if (limitsErr) {
    logger.warn({ contractorId, operation: "createTemplate", errorCode: limitsErr.code }, "Template limit reached");
    return [limitsErr, null];
  }

  const { name, description, steps } = formData;
  const [createErr, template] = await createTemplateDb({
    contractorId,
    createTemplateData: {
      name,
      description,
      steps: steps.map((s, i) => ({ title: s.title, description: s.description ?? null, orderIndex: i }))
    }
  });
  if (createErr) {
    logger.error({ contractorId, operation: "createTemplate", errorCode: createErr.code }, "DB insert failed");
    return [createErr, null];
  }

  logger.info({ contractorId, templateId: template.id }, "Template created successfully");
  return [null, template];
}

export async function updateTemplate({
  contractorId,
  templateId,
  formData
}: {
  contractorId: string;
  templateId: string;
  formData: TemplateFormData;
}): Promise<TemplateMutationResult<Template>> {
  logger.info({ contractorId, templateId }, "Updating template");

  const [roleErr] = await requireRole(contractorId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ contractorId, operation: "updateTemplate", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [ownerErr] = await checkOwnership(templateId, contractorId);
  if (ownerErr) return [ownerErr, null];

  const { name, description, steps } = formData;
  const [updateErr, updated] = await updateTemplateDb({
    id: templateId,
    updateInput: {
      name,
      description,
      steps: steps.map((s, i) => ({ title: s.title, description: s.description ?? null, orderIndex: i }))
    }
  });
  if (updateErr) {
    logger.error(
      { contractorId, templateId, operation: "updateTemplate", errorCode: updateErr.code },
      "DB update failed"
    );
    return [updateErr, null];
  }

  logger.info({ contractorId, templateId }, "Template updated successfully");
  return [null, updated];
}

export async function deleteTemplate({
  contractorId,
  templateId
}: {
  contractorId: string;
  templateId: string;
}): Promise<TemplateMutationResult<{ id: string }>> {
  logger.info({ contractorId, templateId }, "Deleting template");

  const [roleErr] = await requireRole(contractorId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ contractorId, operation: "deleteTemplate", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [ownerErr] = await checkOwnership(templateId, contractorId);
  if (ownerErr) return [ownerErr, null];

  const [deleteErr] = await deleteTemplateDb({ id: templateId });
  if (deleteErr) {
    logger.error(
      { contractorId, templateId, operation: "deleteTemplate", errorCode: deleteErr.code },
      "DB delete failed"
    );
    return [deleteErr, null];
  }

  logger.info({ contractorId, templateId }, "Template deleted successfully");
  return [null, { id: templateId }];
}

export async function duplicateTemplate({
  contractorId,
  templateId
}: {
  contractorId: string;
  templateId: string;
}): Promise<TemplateMutationResult<Template>> {
  logger.info({ contractorId, templateId }, "Duplicating template");

  const [roleErr] = await requireRole(contractorId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ contractorId, operation: "duplicateTemplate", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [limitsErr] = await canAddTemplate(contractorId);
  if (limitsErr) {
    logger.warn({ contractorId, operation: "duplicateTemplate", errorCode: limitsErr.code }, "Template limit reached");
    return [limitsErr, null];
  }

  const [ownerErr, existing] = await checkOwnership(templateId, contractorId);
  if (ownerErr) return [ownerErr, null];

  const [createErr, template] = await createTemplateDb({
    contractorId: existing.contractorId,
    createTemplateData: {
      name: `[Kopia] ${existing.name}`,
      description: existing.description,
      steps: existing.steps
    }
  });
  if (createErr) {
    logger.error(
      { contractorId, templateId, operation: "duplicateTemplate", errorCode: createErr.code },
      "DB insert failed"
    );
    return [createErr, null];
  }

  logger.info({ contractorId, templateId, newTemplateId: template.id }, "Template duplicated successfully");
  return [null, template];
}

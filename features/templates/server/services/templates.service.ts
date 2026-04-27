import { cache } from "react";

import { Role } from "~/features/auth/constants/roles";
import { requireRole } from "~/features/auth/server/api/require-role";
import { getPlanFeatures } from "~/features/billing/server";
import { getCachedContractorProfile } from "~/features/contractor/server/db";
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
import { type BaseServiceError, type ServiceResult } from "~/lib/services/errors";
import { SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { type Template } from "../db/schema";

const logger = createLogger({ module: "templates-service" });

// ---------------------------------------------------------------------------
// Read service (cached for request deduplication during render)
// ---------------------------------------------------------------------------

export const getTemplateList = cache(async function (
  userId: string,
  options: TemplateListOptions
): Promise<SupabaseServiceResult<TemplateListResult>> {
  logger.info({ userId, ...options }, "Loading template list");

  const [profileError, profile] = await getCachedContractorProfile({ contractorId: userId });
  if (profileError) {
    logger.error({ userId, errorCode: profileError.code }, "Failed to load contractor profile for template list");
    return [profileError, null];
  }

  return getTemplateListByContractor({ contractorId: profile.id, options });
});

export type TemplateLimits = {
  used: number;
  max: number | null;
};

export const getTemplateLimits = cache(async function (userId: string): Promise<SupabaseServiceResult<TemplateLimits>> {
  logger.info({ userId }, "Loading template limits");

  const [profileError, profile] = await getCachedContractorProfile({ contractorId: userId });
  if (profileError) {
    logger.error({ userId, errorCode: profileError.code }, "Failed to load contractor profile for template limits");
    return [profileError, null];
  }

  const [countError, used] = await getTemplateCountByContractor({ contractorId: profile.id });
  if (countError) {
    logger.error({ userId, errorCode: countError.code }, "Failed to count templates");
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

export type TemplateMutationResult<T> = ServiceResult<BaseServiceError, T>;

export async function createTemplate(
  userId: string,
  formData: TemplateFormData
): Promise<TemplateMutationResult<Template>> {
  logger.info({ userId }, "Creating template");

  const [roleErr] = await requireRole(userId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ userId, operation: "createTemplate", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [profileErr, profile] = await getCachedContractorProfile({ contractorId: userId });
  if (profileErr) {
    logger.error(
      { userId, operation: "createTemplate", errorCode: profileErr.code },
      "Failed to load contractor profile"
    );
    return [profileErr, null];
  }

  const [limitsErr] = await canAddTemplate(profile.id);
  if (limitsErr) {
    logger.warn({ userId, operation: "createTemplate", errorCode: limitsErr.code }, "Template limit reached");
    return [limitsErr, null];
  }

  const { name, description, steps } = formData;
  const [createErr, template] = await createTemplateDb({
    contractorId: profile.id,
    createTemplateData: {
      name,
      description,
      steps: steps.map((s, i) => ({ title: s.title, description: s.description ?? null, orderIndex: i }))
    }
  });
  if (createErr) {
    logger.error({ userId, operation: "createTemplate", errorCode: createErr.code }, "DB insert failed");
    return [createErr, null];
  }

  logger.info({ userId, templateId: template.id }, "Template created successfully");
  return [null, template];
}

export async function updateTemplate(
  userId: string,
  id: string,
  formData: TemplateFormData
): Promise<TemplateMutationResult<Template>> {
  logger.info({ userId, templateId: id }, "Updating template");

  const [roleErr] = await requireRole(userId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ userId, operation: "updateTemplate", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [profileErr, profile] = await getCachedContractorProfile({ contractorId: userId });
  if (profileErr) {
    logger.error(
      { userId, operation: "updateTemplate", errorCode: profileErr.code },
      "Failed to load contractor profile"
    );
    return [profileErr, null];
  }

  const [ownerErr] = await checkOwnership(id, profile.id);
  if (ownerErr) return [ownerErr, null];

  const { name, description, steps } = formData;
  const [updateErr, updated] = await updateTemplateDb({
    id,
    updateInput: {
      name,
      description,
      steps: steps.map((s, i) => ({ title: s.title, description: s.description ?? null, orderIndex: i }))
    }
  });
  if (updateErr) {
    logger.error(
      { userId, templateId: id, operation: "updateTemplate", errorCode: updateErr.code },
      "DB update failed"
    );
    return [updateErr, null];
  }

  logger.info({ userId, templateId: id }, "Template updated successfully");
  return [null, updated];
}

export async function deleteTemplate(userId: string, id: string): Promise<TemplateMutationResult<{ id: string }>> {
  logger.info({ userId, templateId: id }, "Deleting template");

  const [roleErr] = await requireRole(userId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ userId, operation: "deleteTemplate", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [profileErr, profile] = await getCachedContractorProfile({ contractorId: userId });
  if (profileErr) {
    logger.error(
      { userId, operation: "deleteTemplate", errorCode: profileErr.code },
      "Failed to load contractor profile"
    );
    return [profileErr, null];
  }

  const [ownerErr] = await checkOwnership(id, profile.id);
  if (ownerErr) return [ownerErr, null];

  const [deleteErr] = await deleteTemplateDb({ id });
  if (deleteErr) {
    logger.error(
      { userId, templateId: id, operation: "deleteTemplate", errorCode: deleteErr.code },
      "DB delete failed"
    );
    return [deleteErr, null];
  }

  logger.info({ userId, templateId: id }, "Template deleted successfully");
  return [null, { id }];
}

export async function duplicateTemplate(userId: string, templateId: string): Promise<TemplateMutationResult<Template>> {
  logger.info({ userId, templateId }, "Duplicating template");

  const [roleErr] = await requireRole(userId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ userId, operation: "duplicateTemplate", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [profileErr, profile] = await getCachedContractorProfile({ contractorId: userId });
  if (profileErr) {
    logger.error(
      { userId, operation: "duplicateTemplate", errorCode: profileErr.code },
      "Failed to load contractor profile"
    );
    return [profileErr, null];
  }

  const [limitsErr] = await canAddTemplate(profile.id);
  if (limitsErr) {
    logger.warn({ userId, operation: "duplicateTemplate", errorCode: limitsErr.code }, "Template limit reached");
    return [limitsErr, null];
  }

  const [ownerErr, existing] = await checkOwnership(templateId, profile.id);
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
    logger.error({ userId, templateId, operation: "duplicateTemplate", errorCode: createErr.code }, "DB insert failed");
    return [createErr, null];
  }

  logger.info({ userId, templateId, newTemplateId: template.id }, "Template duplicated successfully");
  return [null, template];
}

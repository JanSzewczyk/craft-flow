import { cache } from "react";

import { Role } from "~/features/auth/constants/roles";
import { requireRole } from "~/features/auth/server/api/require-role";
import { type BrandingFormData } from "~/features/contractor/schemas/branding-schema";
import { type EmailFormData } from "~/features/contractor/schemas/email-schema";
import { getCachedContractorProfile } from "~/features/contractor/server/db";
import { updateContractorProfile } from "~/features/contractor/server/db/contractor-profile/mutations";
import { type ContractorProfile } from "~/features/contractor/server/db/contractor-profile/schema";
import { upsertEmailTemplate } from "~/features/contractor/server/db/email-templates/mutations";
import { getEmailTemplateByType } from "~/features/contractor/server/db/email-templates/queries";
import { type EmailTemplate, EmailTemplateType } from "~/features/contractor/server/db/email-templates/schema";
import { canEditBranding, canEditEmailTemplates } from "~/features/contractor/server/permissions";
import { createLogger } from "~/lib/logger";
import { type BaseServiceError, type ServiceResult } from "~/lib/services/errors";

const logger = createLogger({ module: "branding-service" });

// ---------------------------------------------------------------------------
// Read (cached)
// ---------------------------------------------------------------------------

export type BrandingData = Pick<ContractorProfile, "brandColor" | "logoUrl">;

export const getBrandingData = cache(async function (
  userId: string
): Promise<ServiceResult<BaseServiceError, BrandingData>> {
  logger.info({ userId }, "Loading branding data");

  const [profileErr, profile] = await getCachedContractorProfile({ contractorId: userId });
  if (profileErr) {
    logger.error({ userId, errorCode: profileErr.code }, "Failed to load contractor profile");
    return [profileErr, null];
  }

  return [null, { brandColor: profile.brandColor, logoUrl: profile.logoUrl }];
});

export type EmailTemplateData = {
  subject: string;
  body: string;
};

export const getEmailTemplateData = cache(async function (
  userId: string
): Promise<ServiceResult<BaseServiceError, EmailTemplateData | null>> {
  logger.info({ userId }, "Loading email template data");

  const [profileErr, profile] = await getCachedContractorProfile({ contractorId: userId });
  if (profileErr) {
    logger.error({ userId, errorCode: profileErr.code }, "Failed to load contractor profile");
    return [profileErr, null];
  }

  const [templateErr, template] = await getEmailTemplateByType({
    contractorId: profile.id,
    type: EmailTemplateType.WELCOME
  });
  if (templateErr) {
    if (templateErr.code === "not_found") {
      return [null, null];
    }
    logger.error({ userId, errorCode: templateErr.code }, "Failed to load email template");
    return [templateErr, null];
  }

  return [null, { subject: template.subject, body: template.body }];
});

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export async function updateBranding(
  userId: string,
  data: BrandingFormData
): Promise<ServiceResult<BaseServiceError, BrandingData>> {
  logger.info({ userId }, "Updating branding");

  const [roleErr] = await requireRole(userId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ userId, operation: "updateBranding", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [profileErr] = await getCachedContractorProfile({ contractorId: userId });
  if (profileErr) {
    logger.error({ userId, operation: "updateBranding", errorCode: profileErr.code }, "Profile not found");
    return [profileErr, null];
  }

  const [permErr] = await canEditBranding();
  if (permErr) {
    logger.warn({ userId, operation: "updateBranding", errorCode: permErr.code }, "Permission denied");
    return [permErr, null];
  }

  const [updateErr, updated] = await updateContractorProfile({
    contractorId: userId,
    data: { brandColor: data.brandColor, logoUrl: data.logoUrl }
  });
  if (updateErr) {
    logger.error({ userId, operation: "updateBranding", errorCode: updateErr.code }, "DB update failed");
    return [updateErr, null];
  }

  logger.info({ userId }, "Branding updated successfully");
  return [null, { brandColor: updated.brandColor, logoUrl: updated.logoUrl }];
}

export async function saveEmailTemplate(
  userId: string,
  data: EmailFormData
): Promise<ServiceResult<BaseServiceError, EmailTemplate>> {
  logger.info({ userId }, "Saving email template");

  const [roleErr] = await requireRole(userId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ userId, operation: "saveEmailTemplate", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [profileErr, profile] = await getCachedContractorProfile({ contractorId: userId });
  if (profileErr) {
    logger.error({ userId, operation: "saveEmailTemplate", errorCode: profileErr.code }, "Profile not found");
    return [profileErr, null];
  }

  const [permErr] = await canEditEmailTemplates();
  if (permErr) {
    logger.warn({ userId, operation: "saveEmailTemplate", errorCode: permErr.code }, "Permission denied");
    return [permErr, null];
  }

  const [dbErr, template] = await upsertEmailTemplate({
    contractorId: profile.id,
    data: { type: EmailTemplateType.WELCOME, subject: data.emailSubject, body: data.emailBody }
  });
  if (dbErr) {
    logger.error({ userId, operation: "saveEmailTemplate", errorCode: dbErr.code }, "DB upsert failed");
    return [dbErr, null];
  }

  logger.info({ userId }, "Email template saved successfully");
  return [null, template];
}

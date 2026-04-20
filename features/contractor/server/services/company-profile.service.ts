import { cache } from "react";

import { Role } from "~/features/auth/constants/roles";
import { requireRole } from "~/features/auth/server/api/require-role";
import { type CompanyDetailsFormData } from "~/features/contractor/schemas/company-details-schema";
import { getCachedContractorProfile } from "~/features/contractor/server/db";
import { updateContractorProfile } from "~/features/contractor/server/db/contractor-profile/mutations";
import { type ContractorProfile } from "~/features/contractor/server/db/contractor-profile/schema";
import { createLogger } from "~/lib/logger";
import { type BaseServiceError, type ServiceResult } from "~/lib/services/errors";

const logger = createLogger({ module: "company-profile-service" });

// ---------------------------------------------------------------------------
// Read (cached)
// ---------------------------------------------------------------------------

export type CompanyProfileData = Pick<ContractorProfile, "companyName" | "industry" | "phone">;

export const getCompanyProfileData = cache(async function (
  userId: string
): Promise<ServiceResult<BaseServiceError, CompanyProfileData>> {
  logger.info({ userId }, "Loading company profile data");

  const [profileErr, profile] = await getCachedContractorProfile(userId);
  if (profileErr) {
    logger.error({ userId, errorCode: profileErr.code }, "Failed to load contractor profile");
    return [profileErr, null];
  }

  return [null, { companyName: profile.companyName, industry: profile.industry, phone: profile.phone }];
});

// ---------------------------------------------------------------------------
// Mutation
// ---------------------------------------------------------------------------

export async function updateCompanyProfileData(
  userId: string,
  data: CompanyDetailsFormData
): Promise<ServiceResult<BaseServiceError, CompanyProfileData>> {
  logger.info({ userId }, "Updating company profile");

  const [roleErr] = await requireRole(userId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ userId, operation: "updateCompanyProfile", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [profileErr] = await getCachedContractorProfile(userId);
  if (profileErr) {
    logger.error({ userId, operation: "updateCompanyProfile", errorCode: profileErr.code }, "Profile not found");
    return [profileErr, null];
  }

  const [updateErr, updated] = await updateContractorProfile(userId, {
    companyName: data.companyName,
    industry: data.industry,
    phone: data.phone
  });
  if (updateErr) {
    logger.error({ userId, operation: "updateCompanyProfile", errorCode: updateErr.code }, "DB update failed");
    return [updateErr, null];
  }

  logger.info({ userId }, "Company profile updated successfully");
  return [null, { companyName: updated.companyName, industry: updated.industry, phone: updated.phone }];
}

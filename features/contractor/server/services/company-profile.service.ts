import { cache } from "react";

import { Role } from "~/features/auth/constants/roles";
import { requireRole } from "~/features/auth/server/api/require-role";
import { type CompanyDetailsFormData } from "~/features/contractor/schemas/company-details-schema";
import { getCachedContractorProfile, updateContractorProfileWithAddress } from "~/features/contractor/server/db";
import { createLogger } from "~/lib/logger";
import { type BaseServiceError, type ServiceResult } from "~/lib/services/errors";

const logger = createLogger({ module: "company-profile-service" });

// ---------------------------------------------------------------------------
// Read (cached)
// ---------------------------------------------------------------------------

export type CompanyProfileData = {
  companyName: string;
  industry: string;
  phone: string | null;
  nip: string | null;
  email: string | null;
  addressId: string | null;
  address: {
    id: string;
    street: string | null;
    postalCode: string | null;
    city: string | null;
    country: string | null;
    additionalInfo: string | null;
  } | null;
};

export const getCompanyProfileData = cache(async function (
  userId: string
): Promise<ServiceResult<BaseServiceError, CompanyProfileData>> {
  logger.info({ userId }, "Loading company profile data");

  const [profileErr, profile] = await getCachedContractorProfile(userId);
  if (profileErr) {
    logger.error({ userId, errorCode: profileErr.code }, "Failed to load contractor profile");
    return [profileErr, null];
  }

  return [
    null,
    {
      companyName: profile.companyName,
      industry: profile.industry,
      phone: profile.phone,
      nip: profile.nip ?? null,
      email: profile.email ?? null,
      addressId: profile.addressId ?? null,
      address: profile.address
    }
  ];
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

  const [profileErr, profile] = await getCachedContractorProfile(userId);
  if (profileErr) {
    logger.error({ userId, operation: "updateCompanyProfile", errorCode: profileErr.code }, "Profile not found");
    return [profileErr, null];
  }

  // Determine resolved address: null if no address provided or all key fields are empty
  const raw = data.address;
  const resolvedAddress =
    !raw || (!raw.street && !raw.postalCode && !raw.city)
      ? null
      : {
          street: raw.street,
          postalCode: raw.postalCode,
          city: raw.city,
          country: raw.country,
          additionalInfo: raw.additionalInfo
        };

  const [updateErr, updated] = await updateContractorProfileWithAddress(userId, {
    companyName: data.companyName,
    industry: data.industry,
    phone: data.phone,
    nip: data.nip ?? null,
    email: data.email,
    address: resolvedAddress,
    existingAddressId: profile.addressId ?? null
  });

  if (updateErr) {
    logger.error({ userId, operation: "updateCompanyProfile", errorCode: updateErr.code }, "DB update failed");
    return [updateErr, null];
  }

  logger.info({ userId }, "Company profile updated successfully");
  return [
    null,
    {
      companyName: updated.companyName,
      industry: updated.industry,
      phone: updated.phone,
      nip: updated.nip ?? null,
      email: updated.email ?? null,
      addressId: updated.addressId ?? null,
      address: updated.address
    }
  ];
}

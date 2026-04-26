import { cache } from "react";

import { Role } from "~/features/auth/constants/roles";
import { requireRole } from "~/features/auth/server/api/require-role";
import { type CompanyDetailsFormData } from "~/features/contractor/schemas";
import {
  type ContractorProfile,
  getCachedContractorProfile,
  updateContractorProfile
} from "~/features/contractor/server/db";
import { getContractorProfile } from "~/features/contractor/server/db/contractor-profile/queries";
import { deleteAddress, insertAddress, updateAddress } from "~/features/shared/server/db/addresses";
import { createLogger } from "~/lib/logger";
import { type BaseServiceError, type ServiceResult } from "~/lib/services/errors";
import { withTransaction } from "~/lib/supabase/db";
import { categorizeSupabaseError } from "~/lib/supabase/errors";

const logger = createLogger({ module: "company-profile-service" });

// ---------------------------------------------------------------------------
// Read (cached)
// ---------------------------------------------------------------------------

export type CompanyProfile = Pick<
  ContractorProfile,
  "companyName" | "industry" | "phone" | "nip" | "regon" | "email" | "address"
>;

export const getCompanyProfile = cache(async function (
  userId: string
): Promise<ServiceResult<BaseServiceError, CompanyProfile>> {
  logger.info({ userId }, "Loading company profile data");

  const [profileErr, profile] = await getCachedContractorProfile({ contractorId: userId });
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
      nip: profile.nip,
      regon: profile.regon,
      email: profile.email,
      address: profile.address
    }
  ];
});

// ---------------------------------------------------------------------------
// Mutation
// ---------------------------------------------------------------------------

export async function updateCompanyProfile(
  userId: string,
  data: CompanyDetailsFormData
): Promise<ServiceResult<BaseServiceError, CompanyProfile>> {
  logger.info({ userId }, "Updating company profile");

  const [roleErr] = await requireRole(userId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ userId, operation: "updateCompanyProfile", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [profileErr, profile] = await getCachedContractorProfile({ contractorId: userId });
  if (profileErr) {
    logger.error({ userId, operation: "updateCompanyProfile", errorCode: profileErr.code }, "Profile not found");
    return [profileErr, null];
  }

  const profileFields = {
    companyName: data.companyName,
    industry: data.industry,
    phone: data.phone,
    nip: data.nip,
    regon: data.regon,
    email: data.email
  };
  const { address } = data;
  const existingAddressId = profile.addressId;

  try {
    await withTransaction(async (tx) => {
      if (resolvedAddress === null) {
        // Case 1: remove address (or no address before and after)
        const [profErr] = await updateContractorProfile({
          contractorId: userId,
          data: { ...profileFields, addressId: null },
          dbClient: tx
        });
        if (profErr) throw profErr;

        if (existingAddressId) {
          const [delErr] = await deleteAddress({ addressId: existingAddressId, dbClient: tx });
          if (delErr) throw delErr;
        }
      } else if (!existingAddressId) {
        // Case 2: create new address
        const [addrErr, addr] = await insertAddress({ data: resolvedAddress, dbClient: tx });
        if (addrErr) throw addrErr;

        const [profErr] = await updateContractorProfile({
          contractorId: userId,
          data: { ...profileFields, addressId: addr.id },
          dbClient: tx
        });
        if (profErr) throw profErr;
      } else {
        // Case 3: update existing address
        const [addrErr] = await updateAddress({ addressId: existingAddressId, data: resolvedAddress, dbClient: tx });
        if (addrErr) throw addrErr;

        const [profErr] = await updateContractorProfile({
          contractorId: userId,
          data: profileFields,
          dbClient: tx
        });
        if (profErr) throw profErr;
      }
    });
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, "CompanyProfile");
    logger.error({ userId, operation: "updateCompanyProfile", errorCode: serviceError.code }, "Transaction failed");
    return [serviceError, null];
  }

  const [fetchErr, updated] = await getContractorProfile({ contractorId: userId });
  if (fetchErr) {
    logger.error(
      { userId, operation: "updateCompanyProfile", errorCode: fetchErr.code },
      "Re-fetch after update failed"
    );
    return [fetchErr, null];
  }

  logger.info({ userId }, "Company profile updated successfully");
  return [
    null,
    {
      companyName: updated.companyName,
      industry: updated.industry,
      phone: updated.phone,
      nip: updated.nip,
      regon: updated.regon,
      email: updated.email,
      address: updated.address
    }
  ];
}

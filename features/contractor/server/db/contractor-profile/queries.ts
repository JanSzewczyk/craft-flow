import { cache } from "react";

import { eq } from "drizzle-orm";

import { addresses, type Address } from "~/features/shared/server/db/schema";
import { createLogger } from "~/lib/logger";
import { db } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { contractorProfile, type ContractorProfile } from "./schema";

const logger = createLogger({ module: "contractor-db" });
const RESOURCE_NAME = "ContractorProfile";

export type ContractorProfileWithAddress = ContractorProfile & {
  address: Address | null;
};

export async function getContractorProfile(
  contractorId: string
): Promise<SupabaseServiceResult<ContractorProfileWithAddress>> {
  try {
    const rows = await db
      .select({
        id: contractorProfile.id,
        companyName: contractorProfile.companyName,
        industry: contractorProfile.industry,
        phone: contractorProfile.phone,
        nip: contractorProfile.nip,
        email: contractorProfile.email,
        brandColor: contractorProfile.brandColor,
        logoUrl: contractorProfile.logoUrl,
        addressId: contractorProfile.addressId,
        createdAt: contractorProfile.createdAt,
        updatedAt: contractorProfile.updatedAt,
        address: {
          id: addresses.id,
          street: addresses.street,
          postalCode: addresses.postalCode,
          city: addresses.city,
          country: addresses.country,
          additionalInfo: addresses.additionalInfo,
          createdAt: addresses.createdAt,
          updatedAt: addresses.updatedAt
        }
      })
      .from(contractorProfile)
      .leftJoin(addresses, eq(contractorProfile.addressId, addresses.id))
      .where(eq(contractorProfile.id, contractorId));

    const row = rows[0];

    if (!row) {
      const error = SupabaseServiceError.notFound(RESOURCE_NAME);
      logger.error({ contractorId, errorCode: error.code }, "Contractor profile not found");
      return [error, null];
    }

    // Drizzle returns all-null address shape when LEFT JOIN has no match
    const address: Address | null = row.address == null || row.address.id === null ? null : (row.address as Address);

    return [null, { ...row, address }];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to get contractor profile");
    return [serviceError, null];
  }
}

export const getCachedContractorProfile = cache(getContractorProfile);

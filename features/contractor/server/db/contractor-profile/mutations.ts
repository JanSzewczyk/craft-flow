import { eq } from "drizzle-orm";

import { addresses } from "~/features/shared/server/db/schema";
import { createLogger } from "~/lib/logger";
import { db, type DbClient } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { getContractorProfile, type ContractorProfile as ContractorProfileWithAddress } from "./queries";
import { contractorProfile, type ContractorProfile } from "./schema";

const logger = createLogger({ module: "contractor-db" });
const RESOURCE_NAME = "ContractorProfile";

type UpsertData = Pick<ContractorProfile, "companyName" | "industry" | "email"> &
  Partial<Pick<ContractorProfile, "phone" | "nip" | "regon" | "brandColor" | "logoUrl">>;

export async function upsertContractorProfile({
  contractorId,
  data,
  dbClient = db
}: {
  contractorId: string;
  data: UpsertData;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<ContractorProfile>> {
  try {
    const rows = await dbClient
      .insert(contractorProfile)
      .values({ id: contractorId, ...data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: contractorProfile.id,
        set: { ...data, updatedAt: new Date() }
      })
      .returning();

    const row = rows[0];
    if (!row) {
      const error = SupabaseServiceError.unknown(`Failed to upsert ${RESOURCE_NAME} — no row returned`);
      logger.error({ contractorId, errorCode: error.code }, "Upsert returned no rows");
      return [error, null];
    }

    logger.info({ contractorId }, "Upserted contractor profile");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to upsert contractor profile");
    return [serviceError, null];
  }
}

export async function updateContractorProfile({
  contractorId,
  data,
  dbClient = db
}: {
  contractorId: string;
  data: Partial<UpsertData>;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<ContractorProfile>> {
  try {
    const [row] = await dbClient
      .update(contractorProfile)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(contractorProfile.id, contractorId))
      .returning();

    if (!row) {
      const error = SupabaseServiceError.notFound(RESOURCE_NAME);
      logger.error({ contractorId, errorCode: error.code }, "Update returned no rows");
      return [error, null];
    }

    logger.info({ contractorId }, "Updated contractor profile");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to update contractor profile");
    return [serviceError, null];
  }
}

export type AddressInput = {
  street: string;
  postalCode: string;
  city: string;
  country: string;
  additionalInfo: string | null | undefined;
};

export type UpdateWithAddressInput = {
  companyName: string;
  industry: string;
  phone: string | null;
  nip: string | null | undefined;
  regon: string | null | undefined;
  email: string;
  address: AddressInput | null;
  existingAddressId: string | null;
};

export async function updateContractorProfileWithAddress({
  contractorId,
  input,
  dbClient = db
}: {
  contractorId: string;
  input: UpdateWithAddressInput;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<ContractorProfileWithAddress>> {
  try {
    await dbClient.transaction(async (tx) => {
      if (input.address === null) {
        // Case 1: remove address
        await tx
          .update(contractorProfile)
          .set({
            companyName: input.companyName,
            industry: input.industry,
            phone: input.phone,
            nip: input.nip ?? null,
            regon: input.regon ?? null,
            email: input.email,
            addressId: null,
            updatedAt: new Date()
          })
          .where(eq(contractorProfile.id, contractorId));

        if (input.existingAddressId !== null) {
          await tx.delete(addresses).where(eq(addresses.id, input.existingAddressId));
        }
      } else if (input.existingAddressId === null) {
        // Case 2: create new address
        const newAddressRows = await tx
          .insert(addresses)
          .values({ ...input.address, updatedAt: new Date() })
          .returning();

        const newAddr = newAddressRows[0];
        if (!newAddr) {
          throw SupabaseServiceError.unknown("Failed to insert address — no row returned");
        }

        await tx
          .update(contractorProfile)
          .set({
            companyName: input.companyName,
            industry: input.industry,
            phone: input.phone,
            nip: input.nip ?? null,
            regon: input.regon ?? null,
            email: input.email,
            addressId: newAddr.id,
            updatedAt: new Date()
          })
          .where(eq(contractorProfile.id, contractorId));
      } else {
        // Case 3: update existing address
        await tx
          .update(addresses)
          .set({ ...input.address, updatedAt: new Date() })
          .where(eq(addresses.id, input.existingAddressId));

        await tx
          .update(contractorProfile)
          .set({
            companyName: input.companyName,
            industry: input.industry,
            phone: input.phone,
            nip: input.nip ?? null,
            regon: input.regon ?? null,
            email: input.email,
            updatedAt: new Date()
          })
          .where(eq(contractorProfile.id, contractorId));
      }
    });

    const [fetchErr, updated] = await getContractorProfile({ contractorId });
    if (fetchErr) {
      logger.error({ contractorId, errorCode: fetchErr.code }, "Failed to re-fetch profile after update");
      return [fetchErr, null];
    }

    logger.info({ contractorId }, "Updated contractor profile with address");
    return [null, updated];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ contractorId, errorCode: serviceError.code }, "Failed to update contractor profile with address");
    return [serviceError, null];
  }
}

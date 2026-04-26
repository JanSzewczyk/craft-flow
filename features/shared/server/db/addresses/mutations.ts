import { eq } from "drizzle-orm";

import { createLogger } from "~/lib/logger";
import { db, type DbClient } from "~/lib/supabase/db";
import { categorizeSupabaseError, SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { addresses, type Address } from "../schema";

const logger = createLogger({ module: "shared-db" });
const RESOURCE_NAME = "Address";

export type AddressData = {
  street: string;
  postalCode: string;
  city: string;
  country: string;
  additionalInfo: string | null | undefined;
};

export async function insertAddress({
  data,
  dbClient = db
}: {
  data: AddressData;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Address>> {
  try {
    const rows = await dbClient
      .insert(addresses)
      .values({ ...data, updatedAt: new Date() })
      .returning();

    const row = rows[0];
    if (!row) {
      const error = SupabaseServiceError.unknown(`Failed to insert ${RESOURCE_NAME} — no row returned`);
      logger.error({ errorCode: error.code }, "Insert returned no rows");
      return [error, null];
    }

    logger.info({ addressId: row.id }, "Inserted address");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ errorCode: serviceError.code }, "Failed to insert address");
    return [serviceError, null];
  }
}

export async function updateAddress({
  addressId,
  data,
  dbClient = db
}: {
  addressId: string;
  data: AddressData;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<Address>> {
  try {
    const [row] = await dbClient
      .update(addresses)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(addresses.id, addressId))
      .returning();

    if (!row) {
      const error = SupabaseServiceError.notFound(RESOURCE_NAME);
      logger.error({ addressId, errorCode: error.code }, "Update returned no rows");
      return [error, null];
    }

    logger.info({ addressId }, "Updated address");
    return [null, row];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ addressId, errorCode: serviceError.code }, "Failed to update address");
    return [serviceError, null];
  }
}

export async function deleteAddress({
  addressId,
  dbClient = db
}: {
  addressId: string;
  dbClient?: DbClient;
}): Promise<SupabaseServiceResult<void>> {
  try {
    await dbClient.delete(addresses).where(eq(addresses.id, addressId));
    logger.info({ addressId }, "Deleted address");
    return [null, undefined];
  } catch (error) {
    const serviceError = categorizeSupabaseError(error, RESOURCE_NAME);
    logger.error({ addressId, errorCode: serviceError.code }, "Failed to delete address");
    return [serviceError, null];
  }
}

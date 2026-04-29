import { cache } from "react";

import { Role } from "~/features/auth/constants/roles";
import { requireRole } from "~/features/auth/server/api/require-role";
import { getContractorProfile } from "~/features/contractor/server/db";
import { type ClientFormData } from "~/features/crm/schemas/client-schema";
import {
  createClient as createClientDb,
  deleteClient as deleteClientDb,
  updateClient as updateClientDb
} from "~/features/crm/server/db/mutations";
import {
  getClientById,
  getClientListByContractor,
  type ClientListOptions,
  type ClientListResult
} from "~/features/crm/server/db/queries";
import { createLogger } from "~/lib/logger";
import { type BaseServiceError, type ServiceResult } from "~/lib/services/errors";
import { SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { type Client } from "../db/schema";

const logger = createLogger({ module: "crm-service" });

// ---------------------------------------------------------------------------
// Read service (cached for request deduplication during render)
// ---------------------------------------------------------------------------

export const getClientList = cache(async function (
  userId: string,
  options: ClientListOptions
): Promise<SupabaseServiceResult<ClientListResult>> {
  logger.info({ userId, ...options }, "Loading client list");

  const [profileError, profile] = await getContractorProfile({ contractorId: userId });
  if (profileError) {
    logger.error({ userId, errorCode: profileError.code }, "Failed to load contractor profile for client list");
    return [profileError, null];
  }

  return getClientListByContractor({ contractorId: profile.id, options });
});

export const getClientDetail = cache(async function (
  userId: string,
  clientId: string
): Promise<SupabaseServiceResult<Client>> {
  logger.info({ userId, clientId }, "Loading client detail");

  const [profileError, profile] = await getContractorProfile({ contractorId: userId });
  if (profileError) {
    logger.error({ userId, errorCode: profileError.code }, "Failed to load contractor profile for client detail");
    return [profileError, null];
  }

  const [clientError, client] = await getClientById({ id: clientId });
  if (clientError) {
    logger.error({ userId, clientId, errorCode: clientError.code }, "Failed to fetch client");
    return [clientError, null];
  }

  if (client.contractorId !== profile.id) {
    logger.warn(
      { userId, clientId, operation: "getClientDetail" },
      "Ownership check failed: client belongs to another contractor"
    );
    return [SupabaseServiceError.unauthorized(), null];
  }

  return [null, client];
});

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

async function checkOwnership(clientId: string, contractorId: string): Promise<SupabaseServiceResult<Client>> {
  const [err, client] = await getClientById({ id: clientId });
  if (err) {
    logger.error({ clientId, operation: "checkOwnership", errorCode: err.code }, "Failed to fetch client");
    return [err, null];
  }

  if (client.contractorId !== contractorId) {
    logger.warn(
      { clientId, contractorId, operation: "checkOwnership" },
      "Ownership check failed: client belongs to another contractor"
    );
    return [SupabaseServiceError.unauthorized(), null];
  }

  return [null, client];
}

// ---------------------------------------------------------------------------
// Mutation service
// ---------------------------------------------------------------------------

export type ClientMutationResult<T> = ServiceResult<BaseServiceError, T>;

export async function createClient(userId: string, data: ClientFormData): Promise<SupabaseServiceResult<Client>> {
  logger.info({ userId }, "Creating client");

  const [roleErr] = await requireRole(userId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ userId, operation: "createClient", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [profileErr, profile] = await getContractorProfile({ contractorId: userId });
  if (profileErr) {
    logger.error(
      { userId, operation: "createClient", errorCode: profileErr.code },
      "Failed to load contractor profile"
    );
    return [profileErr, null];
  }

  const [createErr, client] = await createClientDb({ contractorId: profile.id, data });
  if (createErr) {
    logger.error({ userId, operation: "createClient", errorCode: createErr.code }, "DB insert failed");
    return [createErr, null];
  }

  logger.info({ userId, clientId: client.id }, "Client created successfully");
  return [null, client];
}

export async function updateClient(
  userId: string,
  clientId: string,
  data: ClientFormData
): Promise<ClientMutationResult<Client>> {
  logger.info({ userId, clientId }, "Updating client");

  const [roleErr] = await requireRole(userId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ userId, operation: "updateClient", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [profileErr, profile] = await getContractorProfile({ contractorId: userId });
  if (profileErr) {
    logger.error(
      { userId, operation: "updateClient", errorCode: profileErr.code },
      "Failed to load contractor profile"
    );
    return [profileErr, null];
  }

  const [ownerErr, existing] = await checkOwnership(clientId, profile.id);
  if (ownerErr) return [ownerErr, null];

  if (existing.clerkUserId && data.email !== existing.email) {
    const validationError = SupabaseServiceError.validation("Cannot change email of registered client");
    logger.warn({ userId, clientId, operation: "updateClient" }, "Attempted to change email of registered client");
    return [validationError, null];
  }

  const [updateErr, updated] = await updateClientDb({ id: clientId, data });
  if (updateErr) {
    logger.error({ userId, clientId, operation: "updateClient", errorCode: updateErr.code }, "DB update failed");
    return [updateErr, null];
  }

  logger.info({ userId, clientId }, "Client updated successfully");
  return [null, updated];
}

export async function deleteClient(userId: string, clientId: string): Promise<ClientMutationResult<{ id: string }>> {
  logger.info({ userId, clientId }, "Deleting client");

  const [roleErr] = await requireRole(userId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ userId, operation: "deleteClient", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [profileErr, profile] = await getContractorProfile({ contractorId: userId });
  if (profileErr) {
    logger.error(
      { userId, operation: "deleteClient", errorCode: profileErr.code },
      "Failed to load contractor profile"
    );
    return [profileErr, null];
  }

  const [ownerErr] = await checkOwnership(clientId, profile.id);
  if (ownerErr) return [ownerErr, null];

  const [deleteErr] = await deleteClientDb({ id: clientId });
  if (deleteErr) {
    logger.error({ userId, clientId, operation: "deleteClient", errorCode: deleteErr.code }, "DB delete failed");
    return [deleteErr, null];
  }

  logger.info({ userId, clientId }, "Client deleted successfully");
  return [null, { id: clientId }];
}

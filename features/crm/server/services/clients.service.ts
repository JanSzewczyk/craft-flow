import { cache } from "react";

import { Role } from "~/features/auth/constants/roles";
import { requireRole } from "~/features/auth/server/api/require-role";
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

export const getClientList = cache(async function ({
  contractorId,
  options
}: {
  contractorId: string;
  options: ClientListOptions;
}): Promise<SupabaseServiceResult<ClientListResult>> {
  logger.info({ contractorId, ...options }, "Loading client list");

  return getClientListByContractor({ contractorId, options });
});

export const getClientDetail = cache(async function ({
  contractorId,
  clientId
}: {
  contractorId: string;
  clientId: string;
}): Promise<SupabaseServiceResult<Client>> {
  logger.info({ contractorId, clientId }, "Loading client detail");

  const [clientError, client] = await getClientById({ id: clientId });
  if (clientError) {
    logger.error({ contractorId, clientId, errorCode: clientError.code }, "Failed to fetch client");
    return [clientError, null];
  }

  if (client.contractorId !== contractorId) {
    logger.warn(
      { contractorId, clientId, operation: "getClientDetail" },
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

export async function createClient({
  contractorId,
  data
}: {
  contractorId: string;
  data: ClientFormData;
}): Promise<ClientMutationResult<Client>> {
  logger.info({ contractorId }, "Creating client");

  const [roleErr] = await requireRole(contractorId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ contractorId, operation: "createClient", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [createErr, client] = await createClientDb({ contractorId, data });
  if (createErr) {
    logger.error({ contractorId, operation: "createClient", errorCode: createErr.code }, "DB insert failed");
    return [createErr, null];
  }

  logger.info({ contractorId, clientId: client.id }, "Client created successfully");
  return [null, client];
}

export async function updateClient({
  contractorId,
  clientId,
  data
}: {
  contractorId: string;
  clientId: string;
  data: ClientFormData;
}): Promise<ClientMutationResult<Client>> {
  logger.info({ contractorId, clientId }, "Updating client");

  const [roleErr] = await requireRole(contractorId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ contractorId, operation: "updateClient", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [ownerErr, existing] = await checkOwnership(clientId, contractorId);
  if (ownerErr) return [ownerErr, null];

  if (existing.clerkUserId && data.email !== existing.email) {
    const validationError = SupabaseServiceError.validation("Cannot change email of registered client");
    logger.warn(
      { contractorId, clientId, operation: "updateClient" },
      "Attempted to change email of registered client"
    );
    return [validationError, null];
  }

  const [updateErr, updated] = await updateClientDb({ id: clientId, data });
  if (updateErr) {
    logger.error({ contractorId, clientId, operation: "updateClient", errorCode: updateErr.code }, "DB update failed");
    return [updateErr, null];
  }

  logger.info({ contractorId, clientId }, "Client updated successfully");
  return [null, updated];
}

export async function deleteClient({
  contractorId,
  clientId
}: {
  contractorId: string;
  clientId: string;
}): Promise<ClientMutationResult<{ id: string }>> {
  logger.info({ contractorId, clientId }, "Deleting client");

  const [roleErr] = await requireRole(contractorId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ contractorId, operation: "deleteClient", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  const [ownerErr] = await checkOwnership(clientId, contractorId);
  if (ownerErr) return [ownerErr, null];

  const [deleteErr] = await deleteClientDb({ id: clientId });
  if (deleteErr) {
    logger.error({ contractorId, clientId, operation: "deleteClient", errorCode: deleteErr.code }, "DB delete failed");
    return [deleteErr, null];
  }

  logger.info({ contractorId, clientId }, "Client deleted successfully");
  return [null, { id: clientId }];
}

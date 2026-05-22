import * as React from "react";

import { Role } from "~/features/auth/constants/roles";
import { findOptionalUserByEmail } from "~/features/auth/server/api/find-optional-user-by-email";
import { requireRole } from "~/features/auth/server/api/require-role";
import { type ClientFormData } from "~/features/crm/schemas/client-schema";
import {
  createClientByContractorId,
  deleteClient as deleteClientDb,
  updateClient as updateClientDb
} from "~/features/crm/server/db/mutations";
import {
  getClientById,
  getClientsByClerkUserId,
  getClientListByContractorId,
  type ClientListOptions,
  type ClientListResult
} from "~/features/crm/server/db/queries";
import { createLogger } from "~/lib/logger";
import { type ServiceResult } from "~/lib/services/errors";
import { SupabaseServiceError, type SupabaseServiceResult } from "~/lib/supabase/errors";

import { type Client } from "~/features/crm/types/client";

const logger = createLogger({ module: "crm-service" });

// ---------------------------------------------------------------------------
// Read service (cached for request deduplication during render)
// ---------------------------------------------------------------------------

export const getClientList = React.cache(async function ({
  contractorId,
  options
}: {
  contractorId: string;
  options: ClientListOptions;
}): Promise<ServiceResult<ClientListResult>> {
  logger.info({ contractorId, ...options }, "Loading client list");

  const [roleErr] = await requireRole(contractorId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ contractorId, operation: "createClient", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  return getClientListByContractorId({ contractorId, options });
});

export const getContractorClient = React.cache(async function ({
  contractorId,
  clientId
}: {
  contractorId: string;
  clientId: string;
}): Promise<ServiceResult<Client>> {
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

export async function createClient({
  contractorId,
  data
}: {
  contractorId: string;
  data: ClientFormData;
}): Promise<ServiceResult<Client>> {
  logger.info({ contractorId }, "Creating client");

  const [roleErr] = await requireRole(contractorId, [Role.CONTRACTOR]);
  if (roleErr) {
    logger.warn({ contractorId, operation: "createClient", errorCode: roleErr.code }, "Role check failed");
    return [roleErr, null];
  }

  let clerkUserId: string | null = null;
  if (data.email) {
    const [clerkErr, optionalUser] = await findOptionalUserByEmail(data.email);
    if (clerkErr) {
      logger.warn(
        { contractorId, operation: "createClient", email: data.email },
        "Clerk lookup failed — creating client without clerkUserId"
      );
    } else if (optionalUser) {
      clerkUserId = optionalUser.id;
      logger.info(
        { contractorId, operation: "createClient", email: data.email },
        "Found existing Clerk user for new client"
      );
    }
  }

  const [createErr, client] = await createClientByContractorId({ contractorId, data: { ...data, clerkUserId } });
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
}): Promise<ServiceResult<Client>> {
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

export const getClientsForClerkUser = React.cache(async function (
  clerkUserId: string
): Promise<SupabaseServiceResult<Array<Client>>> {
  const [err, clientRecords] = await getClientsByClerkUserId({ clerkUserId });
  if (err) {
    logger.error({ clerkUserId, errorCode: err.code }, "Failed to fetch client records by clerkUserId");
    return [err, null];
  }

  logger.info({ clerkUserId, count: clientRecords.length }, "Fetched client records by clerkUserId");
  return [null, clientRecords];
});

export async function deleteClient({
  contractorId,
  clientId
}: {
  contractorId: string;
  clientId: string;
}): Promise<ServiceResult<{ id: string }>> {
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

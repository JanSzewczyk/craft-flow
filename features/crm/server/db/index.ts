export { clients } from "./schema";
export type { Client } from "~/features/crm/types/client";
export { createClientByContractorId, updateClient, deleteClient } from "./mutations";
export {
  getClientsByContractorId,
  getClientById,
  getClientListByContractorId,
  getClientCountByContractorId
} from "./queries";
export type { ClientListItem, ClientListOptions, ClientListResult } from "./queries";

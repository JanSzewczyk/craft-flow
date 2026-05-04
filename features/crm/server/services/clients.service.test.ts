const mocks = vi.hoisted(() => ({
  requireRole: vi.fn(),
  findOptionalUserByEmail: vi.fn(),
  getClientById: vi.fn(),
  getClientListByContractorId: vi.fn(),
  createClientByContractorId: vi.fn(),
  updateClient: vi.fn(),
  deleteClient: vi.fn()
}));

vi.mock("~/features/auth/server/api/require-role", () => ({ requireRole: mocks.requireRole }));
vi.mock("~/features/auth/server/api/find-optional-user-by-email", () => ({
  findOptionalUserByEmail: mocks.findOptionalUserByEmail
}));
vi.mock("~/features/crm/server/db/queries", () => ({
  getClientById: mocks.getClientById,
  getClientListByContractorId: mocks.getClientListByContractorId
}));
vi.mock("~/features/crm/server/db/mutations", () => ({
  createClientByContractorId: mocks.createClientByContractorId,
  updateClient: mocks.updateClient,
  deleteClient: mocks.deleteClient
}));

import {
  createClient,
  deleteClient,
  getContractorClient,
  getClientList,
  updateClient
} from "~/features/crm/server/services/clients.service";
import { clientBuilder, clientFormBuilder } from "~/features/crm/test/builders";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const contractorId = "contractor-123";
const clientId = "client-789";

const dbError = { code: "unknown", message: "DB error" };
const roleError = { code: "permission_denied", message: "Role check failed" };

// ─── Helper: setup common happy-path mocks ────────────────────────────────────

function setupRole() {
  mocks.requireRole.mockResolvedValue([null, undefined]);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("clients.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.findOptionalUserByEmail.mockResolvedValue([null, null]);
  });

  // ---------------------------------------------------------------------------
  // getClientList
  // ---------------------------------------------------------------------------

  describe("getClientList", () => {
    const options = { page: 1, perPage: 10 };

    test("delegates to getClientListByContractorId with contractorId and options", async () => {
      setupRole();
      const listResult = { items: [], pagination: {} };
      mocks.getClientListByContractorId.mockResolvedValue([null, listResult]);

      const [err, result] = await getClientList({ contractorId, options });

      expect(err).toBeNull();
      expect(result).toBe(listResult);
      expect(mocks.getClientListByContractorId).toHaveBeenCalledWith({ contractorId, options });
    });
  });

  // ---------------------------------------------------------------------------
  // getContractorClient
  // ---------------------------------------------------------------------------

  describe("getContractorClient", () => {
    test("returns error when getClientById fails", async () => {
      const notFoundError = { code: "not_found", message: "Client not found" };
      mocks.getClientById.mockResolvedValue([notFoundError, null]);

      const [err, result] = await getContractorClient({ contractorId, clientId });

      expect(err).toBe(notFoundError);
      expect(result).toBeNull();
    });

    test("returns unauthorized error when client belongs to another contractor", async () => {
      const otherContractorClient = clientBuilder.one({
        overrides: { contractorId: "other-contractor-id" }
      });
      mocks.getClientById.mockResolvedValue([null, otherContractorClient]);

      const [err, result] = await getContractorClient({ contractorId, clientId });

      expect(err).not.toBeNull();
      expect(err?.code).toBe("unauthorized");
      expect(result).toBeNull();
    });

    test("returns client on success", async () => {
      const client = clientBuilder.one({ overrides: { contractorId, id: clientId } });
      mocks.getClientById.mockResolvedValue([null, client]);

      const [err, result] = await getContractorClient({ contractorId, clientId });

      expect(err).toBeNull();
      expect(result).toBe(client);
    });
  });

  // ---------------------------------------------------------------------------
  // createClient
  // ---------------------------------------------------------------------------

  describe("createClient", () => {
    const formData = clientFormBuilder.one();

    test("returns error when requireRole fails", async () => {
      mocks.requireRole.mockResolvedValue([roleError, null]);

      const [err, result] = await createClient({ contractorId, data: formData });

      expect(err).toBe(roleError);
      expect(result).toBeNull();
      expect(mocks.createClientByContractorId).not.toHaveBeenCalled();
    });

    test("returns error when createClient DB call fails", async () => {
      setupRole();
      mocks.createClientByContractorId.mockResolvedValue([dbError, null]);

      const [err, result] = await createClient({ contractorId, data: formData });

      expect(err).toBe(dbError);
      expect(result).toBeNull();
    });

    test("returns the created client on success", async () => {
      setupRole();
      const client = clientBuilder.one({ overrides: { contractorId } });
      mocks.createClientByContractorId.mockResolvedValue([null, client]);

      const [err, result] = await createClient({ contractorId, data: formData });

      expect(err).toBeNull();
      expect(result).toBe(client);
    });

    test("calls createClientByContractorId DB with contractorId and form data plus clerkUserId", async () => {
      setupRole();
      const client = clientBuilder.one({ overrides: { contractorId } });
      mocks.createClientByContractorId.mockResolvedValue([null, client]);

      await createClient({ contractorId, data: formData });

      expect(mocks.createClientByContractorId).toHaveBeenCalledWith({
        contractorId,
        data: { ...formData, clerkUserId: null }
      });
    });
  });

  // ---------------------------------------------------------------------------
  // updateClient
  // ---------------------------------------------------------------------------

  describe("updateClient", () => {
    const formData = clientFormBuilder.one();

    test("returns error when requireRole fails", async () => {
      mocks.requireRole.mockResolvedValue([roleError, null]);

      const [err, result] = await updateClient({ contractorId, clientId, data: formData });

      expect(err).toBe(roleError);
      expect(result).toBeNull();
    });

    test("returns error when ownership check fails (client not found)", async () => {
      setupRole();
      const notFoundError = { code: "not_found", message: "Client not found" };
      mocks.getClientById.mockResolvedValue([notFoundError, null]);

      const [err, result] = await updateClient({ contractorId, clientId, data: formData });

      expect(err).toBe(notFoundError);
      expect(result).toBeNull();
      expect(mocks.updateClient).not.toHaveBeenCalled();
    });

    test("returns error when ownership check fails (belongs to another contractor)", async () => {
      setupRole();
      const otherContractorClient = clientBuilder.one({
        overrides: { contractorId: "other-contractor-id" }
      });
      mocks.getClientById.mockResolvedValue([null, otherContractorClient]);

      const [err, result] = await updateClient({ contractorId, clientId, data: formData });

      expect(err).not.toBeNull();
      expect(err?.code).toBe("unauthorized");
      expect(result).toBeNull();
    });

    test("returns validation error when trying to change email of registered client", async () => {
      setupRole();
      const registeredClient = clientBuilder.one({
        overrides: {
          contractorId,
          id: clientId,
          email: "original@example.com",
          clerkUserId: "clerk-user-abc123"
        }
      });
      mocks.getClientById.mockResolvedValue([null, registeredClient]);
      const dataWithNewEmail = clientFormBuilder.one({
        overrides: { email: "new@example.com" }
      });

      const [err, result] = await updateClient({ contractorId, clientId, data: dataWithNewEmail });

      expect(err).not.toBeNull();
      expect(err?.code).toBe("validation");
      expect(result).toBeNull();
      expect(mocks.updateClient).not.toHaveBeenCalled();
    });

    test("allows changing non-email fields for registered client", async () => {
      setupRole();
      const registeredClient = clientBuilder.one({
        overrides: {
          contractorId,
          id: clientId,
          email: "same@example.com",
          clerkUserId: "clerk-user-abc123"
        }
      });
      const updatedClient = clientBuilder.one({ overrides: { contractorId, id: clientId } });
      mocks.getClientById.mockResolvedValue([null, registeredClient]);
      mocks.updateClient.mockResolvedValue([null, updatedClient]);
      const dataWithSameEmail = clientFormBuilder.one({
        overrides: { email: "same@example.com" }
      });

      const [err, result] = await updateClient({ contractorId, clientId, data: dataWithSameEmail });

      expect(err).toBeNull();
      expect(result).toBe(updatedClient);
    });

    test("returns error when updateClient DB call fails", async () => {
      setupRole();
      const ownedClient = clientBuilder.one({
        overrides: { contractorId, id: clientId, clerkUserId: null }
      });
      mocks.getClientById.mockResolvedValue([null, ownedClient]);
      mocks.updateClient.mockResolvedValue([dbError, null]);

      const [err, result] = await updateClient({ contractorId, clientId, data: formData });

      expect(err).toBe(dbError);
      expect(result).toBeNull();
    });

    test("returns the updated client on success", async () => {
      setupRole();
      const ownedClient = clientBuilder.one({
        overrides: { contractorId, id: clientId, clerkUserId: null }
      });
      const updatedClient = clientBuilder.one({ overrides: { contractorId, id: clientId } });
      mocks.getClientById.mockResolvedValue([null, ownedClient]);
      mocks.updateClient.mockResolvedValue([null, updatedClient]);

      const [err, result] = await updateClient({ contractorId, clientId, data: formData });

      expect(err).toBeNull();
      expect(result).toBe(updatedClient);
    });
  });

  // ---------------------------------------------------------------------------
  // deleteClient
  // ---------------------------------------------------------------------------

  describe("deleteClient", () => {
    test("returns error when requireRole fails", async () => {
      mocks.requireRole.mockResolvedValue([roleError, null]);

      const [err, result] = await deleteClient({ contractorId, clientId });

      expect(err).toBe(roleError);
      expect(result).toBeNull();
    });

    test("returns error when ownership check fails", async () => {
      setupRole();
      const notFoundError = { code: "not_found", message: "Client not found" };
      mocks.getClientById.mockResolvedValue([notFoundError, null]);

      const [err, result] = await deleteClient({ contractorId, clientId });

      expect(err).toBe(notFoundError);
      expect(result).toBeNull();
      expect(mocks.deleteClient).not.toHaveBeenCalled();
    });

    test("returns error when deleteClient DB call fails", async () => {
      setupRole();
      const ownedClient = clientBuilder.one({ overrides: { contractorId, id: clientId } });
      mocks.getClientById.mockResolvedValue([null, ownedClient]);
      mocks.deleteClient.mockResolvedValue([dbError, null]);

      const [err, result] = await deleteClient({ contractorId, clientId });

      expect(err).toBe(dbError);
      expect(result).toBeNull();
    });

    test("returns id on successful deletion", async () => {
      setupRole();
      const ownedClient = clientBuilder.one({ overrides: { contractorId, id: clientId } });
      mocks.getClientById.mockResolvedValue([null, ownedClient]);
      mocks.deleteClient.mockResolvedValue([null, ownedClient]);

      const [err, result] = await deleteClient({ contractorId, clientId });

      expect(err).toBeNull();
      expect(result).toEqual({ id: clientId });
    });
  });
});

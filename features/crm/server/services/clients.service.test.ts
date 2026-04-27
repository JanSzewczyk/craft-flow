const mocks = vi.hoisted(() => ({
  requireRole: vi.fn(),
  getCachedContractorProfile: vi.fn(),
  getClientById: vi.fn(),
  getClientListByContractor: vi.fn(),
  createClient: vi.fn(),
  updateClient: vi.fn(),
  deleteClient: vi.fn()
}));

vi.mock("~/features/auth/server/api/require-role", () => ({ requireRole: mocks.requireRole }));
vi.mock("~/features/contractor/server/db", () => ({
  getCachedContractorProfile: mocks.getCachedContractorProfile
}));
vi.mock("~/features/crm/server/db/queries", () => ({
  getClientById: mocks.getClientById,
  getClientListByContractor: mocks.getClientListByContractor
}));
vi.mock("~/features/crm/server/db/mutations", () => ({
  createClient: mocks.createClient,
  updateClient: mocks.updateClient,
  deleteClient: mocks.deleteClient
}));

import {
  createClient,
  deleteClient,
  getClientDetail,
  getClientList,
  updateClient
} from "~/features/crm/server/services/clients.service";
import { clientBuilder, clientFormBuilder } from "~/features/crm/test/builders";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const userId = "user-123";
const profileId = "profile-456";
const clientId = "client-789";

const profile = { id: profileId };
const dbError = { code: "unknown", message: "DB error" };
const roleError = { code: "permission_denied", message: "Role check failed" };
const profileError = { code: "not_found", message: "Profile not found" };

// ─── Helper: setup common happy-path mocks ────────────────────────────────────

function setupAuthAndProfile() {
  mocks.requireRole.mockResolvedValue([null, undefined]);
  mocks.getCachedContractorProfile.mockResolvedValue([null, profile]);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("clients.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // getClientList
  // ---------------------------------------------------------------------------

  describe("getClientList", () => {
    const options = { page: 1, perPage: 10 };

    test("returns error when getCachedContractorProfile fails", async () => {
      mocks.getCachedContractorProfile.mockResolvedValue([profileError, null]);

      const [err, result] = await getClientList(userId, options);

      expect(err).toBe(profileError);
      expect(result).toBeNull();
      expect(mocks.getClientListByContractor).not.toHaveBeenCalled();
    });

    test("delegates to getClientListByContractor with profile id and options", async () => {
      const listResult = { items: [], pagination: {} };
      mocks.getCachedContractorProfile.mockResolvedValue([null, profile]);
      mocks.getClientListByContractor.mockResolvedValue([null, listResult]);

      const [err, result] = await getClientList(userId, options);

      expect(err).toBeNull();
      expect(result).toBe(listResult);
      expect(mocks.getClientListByContractor).toHaveBeenCalledWith({ contractorId: profileId, options });
    });
  });

  // ---------------------------------------------------------------------------
  // getClientDetail
  // ---------------------------------------------------------------------------

  describe("getClientDetail", () => {
    test("returns error when getCachedContractorProfile fails", async () => {
      mocks.getCachedContractorProfile.mockResolvedValue([profileError, null]);

      const [err, result] = await getClientDetail(userId, clientId);

      expect(err).toBe(profileError);
      expect(result).toBeNull();
      expect(mocks.getClientById).not.toHaveBeenCalled();
    });

    test("returns error when getClientById fails", async () => {
      mocks.getCachedContractorProfile.mockResolvedValue([null, profile]);
      const notFoundError = { code: "not_found", message: "Client not found" };
      mocks.getClientById.mockResolvedValue([notFoundError, null]);

      const [err, result] = await getClientDetail(userId, clientId);

      expect(err).toBe(notFoundError);
      expect(result).toBeNull();
    });

    test("returns unauthorized error when client belongs to another contractor", async () => {
      mocks.getCachedContractorProfile.mockResolvedValue([null, profile]);
      const otherContractorClient = clientBuilder.one({
        overrides: { contractorId: "other-contractor-id" }
      });
      mocks.getClientById.mockResolvedValue([null, otherContractorClient]);

      const [err, result] = await getClientDetail(userId, clientId);

      expect(err).not.toBeNull();
      expect(err?.code).toBe("unauthorized");
      expect(result).toBeNull();
    });

    test("returns client on success", async () => {
      mocks.getCachedContractorProfile.mockResolvedValue([null, profile]);
      const client = clientBuilder.one({ overrides: { contractorId: profileId, id: clientId } });
      mocks.getClientById.mockResolvedValue([null, client]);

      const [err, result] = await getClientDetail(userId, clientId);

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

      const [err, result] = await createClient(userId, formData);

      expect(err).toBe(roleError);
      expect(result).toBeNull();
      expect(mocks.getCachedContractorProfile).not.toHaveBeenCalled();
    });

    test("returns error when getCachedContractorProfile fails", async () => {
      mocks.requireRole.mockResolvedValue([null, undefined]);
      mocks.getCachedContractorProfile.mockResolvedValue([profileError, null]);

      const [err, result] = await createClient(userId, formData);

      expect(err).toBe(profileError);
      expect(result).toBeNull();
      expect(mocks.createClient).not.toHaveBeenCalled();
    });

    test("returns error when createClient DB call fails", async () => {
      setupAuthAndProfile();
      mocks.createClient.mockResolvedValue([dbError, null]);

      const [err, result] = await createClient(userId, formData);

      expect(err).toBe(dbError);
      expect(result).toBeNull();
    });

    test("returns the created client on success", async () => {
      setupAuthAndProfile();
      const client = clientBuilder.one({ overrides: { contractorId: profileId } });
      mocks.createClient.mockResolvedValue([null, client]);

      const [err, result] = await createClient(userId, formData);

      expect(err).toBeNull();
      expect(result).toBe(client);
    });

    test("calls createClient DB with profile id and form data", async () => {
      setupAuthAndProfile();
      const client = clientBuilder.one({ overrides: { contractorId: profileId } });
      mocks.createClient.mockResolvedValue([null, client]);

      await createClient(userId, formData);

      expect(mocks.createClient).toHaveBeenCalledWith({ contractorId: profileId, data: formData });
    });
  });

  // ---------------------------------------------------------------------------
  // updateClient
  // ---------------------------------------------------------------------------

  describe("updateClient", () => {
    const formData = clientFormBuilder.one();

    test("returns error when requireRole fails", async () => {
      mocks.requireRole.mockResolvedValue([roleError, null]);

      const [err, result] = await updateClient(userId, clientId, formData);

      expect(err).toBe(roleError);
      expect(result).toBeNull();
    });

    test("returns error when getCachedContractorProfile fails", async () => {
      mocks.requireRole.mockResolvedValue([null, undefined]);
      mocks.getCachedContractorProfile.mockResolvedValue([profileError, null]);

      const [err, result] = await updateClient(userId, clientId, formData);

      expect(err).toBe(profileError);
      expect(result).toBeNull();
      expect(mocks.getClientById).not.toHaveBeenCalled();
    });

    test("returns error when ownership check fails (client not found)", async () => {
      setupAuthAndProfile();
      const notFoundError = { code: "not_found", message: "Client not found" };
      mocks.getClientById.mockResolvedValue([notFoundError, null]);

      const [err, result] = await updateClient(userId, clientId, formData);

      expect(err).toBe(notFoundError);
      expect(result).toBeNull();
      expect(mocks.updateClient).not.toHaveBeenCalled();
    });

    test("returns error when ownership check fails (belongs to another contractor)", async () => {
      setupAuthAndProfile();
      const otherContractorClient = clientBuilder.one({
        overrides: { contractorId: "other-contractor-id" }
      });
      mocks.getClientById.mockResolvedValue([null, otherContractorClient]);

      const [err, result] = await updateClient(userId, clientId, formData);

      expect(err).not.toBeNull();
      expect(err?.code).toBe("unauthorized");
      expect(result).toBeNull();
    });

    test("returns validation error when trying to change email of registered client", async () => {
      setupAuthAndProfile();
      const registeredClient = clientBuilder.one({
        overrides: {
          contractorId: profileId,
          id: clientId,
          email: "original@example.com",
          clerkUserId: "clerk-user-abc123"
        }
      });
      mocks.getClientById.mockResolvedValue([null, registeredClient]);
      const dataWithNewEmail = clientFormBuilder.one({
        overrides: { email: "new@example.com" }
      });

      const [err, result] = await updateClient(userId, clientId, dataWithNewEmail);

      expect(err).not.toBeNull();
      expect(err?.code).toBe("validation");
      expect(result).toBeNull();
      expect(mocks.updateClient).not.toHaveBeenCalled();
    });

    test("allows changing non-email fields for registered client", async () => {
      setupAuthAndProfile();
      const registeredClient = clientBuilder.one({
        overrides: {
          contractorId: profileId,
          id: clientId,
          email: "same@example.com",
          clerkUserId: "clerk-user-abc123"
        }
      });
      const updatedClient = clientBuilder.one({ overrides: { contractorId: profileId, id: clientId } });
      mocks.getClientById.mockResolvedValue([null, registeredClient]);
      mocks.updateClient.mockResolvedValue([null, updatedClient]);
      const dataWithSameEmail = clientFormBuilder.one({
        overrides: { email: "same@example.com" }
      });

      const [err, result] = await updateClient(userId, clientId, dataWithSameEmail);

      expect(err).toBeNull();
      expect(result).toBe(updatedClient);
    });

    test("returns error when updateClient DB call fails", async () => {
      setupAuthAndProfile();
      const ownedClient = clientBuilder.one({
        overrides: { contractorId: profileId, id: clientId, clerkUserId: null }
      });
      mocks.getClientById.mockResolvedValue([null, ownedClient]);
      mocks.updateClient.mockResolvedValue([dbError, null]);

      const [err, result] = await updateClient(userId, clientId, formData);

      expect(err).toBe(dbError);
      expect(result).toBeNull();
    });

    test("returns the updated client on success", async () => {
      setupAuthAndProfile();
      const ownedClient = clientBuilder.one({
        overrides: { contractorId: profileId, id: clientId, clerkUserId: null }
      });
      const updatedClient = clientBuilder.one({ overrides: { contractorId: profileId, id: clientId } });
      mocks.getClientById.mockResolvedValue([null, ownedClient]);
      mocks.updateClient.mockResolvedValue([null, updatedClient]);

      const [err, result] = await updateClient(userId, clientId, formData);

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

      const [err, result] = await deleteClient(userId, clientId);

      expect(err).toBe(roleError);
      expect(result).toBeNull();
    });

    test("returns error when getCachedContractorProfile fails", async () => {
      mocks.requireRole.mockResolvedValue([null, undefined]);
      mocks.getCachedContractorProfile.mockResolvedValue([profileError, null]);

      const [err, result] = await deleteClient(userId, clientId);

      expect(err).toBe(profileError);
      expect(result).toBeNull();
      expect(mocks.getClientById).not.toHaveBeenCalled();
    });

    test("returns error when ownership check fails", async () => {
      setupAuthAndProfile();
      const notFoundError = { code: "not_found", message: "Client not found" };
      mocks.getClientById.mockResolvedValue([notFoundError, null]);

      const [err, result] = await deleteClient(userId, clientId);

      expect(err).toBe(notFoundError);
      expect(result).toBeNull();
      expect(mocks.deleteClient).not.toHaveBeenCalled();
    });

    test("returns error when deleteClient DB call fails", async () => {
      setupAuthAndProfile();
      const ownedClient = clientBuilder.one({ overrides: { contractorId: profileId, id: clientId } });
      mocks.getClientById.mockResolvedValue([null, ownedClient]);
      mocks.deleteClient.mockResolvedValue([dbError, null]);

      const [err, result] = await deleteClient(userId, clientId);

      expect(err).toBe(dbError);
      expect(result).toBeNull();
    });

    test("returns id on successful deletion", async () => {
      setupAuthAndProfile();
      const ownedClient = clientBuilder.one({ overrides: { contractorId: profileId, id: clientId } });
      mocks.getClientById.mockResolvedValue([null, ownedClient]);
      mocks.deleteClient.mockResolvedValue([null, ownedClient]);

      const [err, result] = await deleteClient(userId, clientId);

      expect(err).toBeNull();
      expect(result).toEqual({ id: clientId });
    });
  });
});

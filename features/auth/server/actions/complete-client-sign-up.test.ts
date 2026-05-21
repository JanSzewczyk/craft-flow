const mocks = vi.hoisted(() => ({
  clerkClient: vi.fn(),
  setUserMetadata: vi.fn(),
  getProjectByPublicToken: vi.fn(),
  updateClient: vi.fn(),
  linkClientsByEmail: vi.fn()
}));

vi.mock("@clerk/nextjs/server", () => ({ clerkClient: mocks.clerkClient }));
vi.mock("../api/set-user-metadata", () => ({ setUserMetadata: mocks.setUserMetadata }));
vi.mock("~/features/projects/server/db/queries", () => ({
  getProjectByPublicToken: mocks.getProjectByPublicToken
}));
vi.mock("~/features/crm/server/db/mutations", () => ({
  updateClient: mocks.updateClient,
  linkClientsByEmail: mocks.linkClientsByEmail
}));

import { ClerkServiceError } from "~/lib/clerk/errors";
import { SupabaseServiceError } from "~/lib/supabase/errors";

import { completeClientSignUp } from "./complete-client-sign-up";

const USER_ID = "user-client-1";
const PRIMARY_EMAIL = "client@example.com";

function makeClerkClient(email: string | null = PRIMARY_EMAIL) {
  return {
    users: {
      getUser: vi.fn().mockResolvedValue({
        primaryEmailAddress: email ? { emailAddress: email } : null
      })
    }
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.clerkClient.mockResolvedValue(makeClerkClient());
  mocks.setUserMetadata.mockResolvedValue([null, undefined]);
  mocks.linkClientsByEmail.mockResolvedValue([null, undefined]);
  mocks.updateClient.mockResolvedValue([null, undefined]);
});

describe("completeClientSignUp", () => {
  describe("validation", () => {
    it("returns error when userId is empty string", async () => {
      const result = await completeClientSignUp({ inviteToken: null, userId: "" });
      expect(result).toEqual({ success: false, error: "Nieprawidłowy identyfikator użytkownika." });
      expect(mocks.clerkClient).not.toHaveBeenCalled();
    });
  });

  describe("missing primary email", () => {
    it("returns error when user has no primary email address", async () => {
      mocks.clerkClient.mockResolvedValue(makeClerkClient(null));
      const result = await completeClientSignUp({ inviteToken: null, userId: USER_ID });
      expect(result).toEqual({
        success: false,
        error: "Nie udało się dokończyć rejestracji. Brak adresu e-mail."
      });
      expect(mocks.setUserMetadata).not.toHaveBeenCalled();
    });
  });

  describe("setUserMetadata failure", () => {
    it("returns error when setting CLIENT role fails", async () => {
      mocks.setUserMetadata.mockResolvedValue([ClerkServiceError.unknown(), null]);
      const result = await completeClientSignUp({ inviteToken: null, userId: USER_ID });
      expect(result).toEqual({
        success: false,
        error: "Nie udało się dokończyć rejestracji. Spróbuj ponownie później."
      });
    });

    it("does not proceed to link clients when setUserMetadata fails", async () => {
      mocks.setUserMetadata.mockResolvedValue([ClerkServiceError.unknown(), null]);
      await completeClientSignUp({ inviteToken: null, userId: USER_ID });
      expect(mocks.linkClientsByEmail).not.toHaveBeenCalled();
    });
  });

  describe("without invite token", () => {
    it("returns success when inviteToken is null", async () => {
      const result = await completeClientSignUp({ inviteToken: null, userId: USER_ID });
      expect(result).toEqual({ success: true, data: true });
    });

    it("does not attempt to resolve project when inviteToken is null", async () => {
      await completeClientSignUp({ inviteToken: null, userId: USER_ID });
      expect(mocks.getProjectByPublicToken).not.toHaveBeenCalled();
      expect(mocks.updateClient).not.toHaveBeenCalled();
    });

    it("calls setUserMetadata with CLIENT role", async () => {
      await completeClientSignUp({ inviteToken: null, userId: USER_ID });
      expect(mocks.setUserMetadata).toHaveBeenCalledWith(USER_ID, { roles: ["CLIENT"] });
    });

    it("calls linkClientsByEmail with email and userId", async () => {
      await completeClientSignUp({ inviteToken: null, userId: USER_ID });
      expect(mocks.linkClientsByEmail).toHaveBeenCalledWith({
        email: PRIMARY_EMAIL,
        clerkUserId: USER_ID
      });
    });

    it("still returns success when linkClientsByEmail fails", async () => {
      mocks.linkClientsByEmail.mockResolvedValue([SupabaseServiceError.unknown(), null]);
      const result = await completeClientSignUp({ inviteToken: null, userId: USER_ID });
      expect(result).toEqual({ success: true, data: true });
    });
  });

  describe("with valid invite token — project found", () => {
    const TOKEN = "invite-token-abc";
    const CLIENT_ID = "client-42";

    beforeEach(() => {
      mocks.getProjectByPublicToken.mockResolvedValue([null, { id: "proj-1", clientId: CLIENT_ID }]);
    });

    it("returns success", async () => {
      const result = await completeClientSignUp({ inviteToken: TOKEN, userId: USER_ID });
      expect(result).toEqual({ success: true, data: true });
    });

    it("calls getProjectByPublicToken with the token", async () => {
      await completeClientSignUp({ inviteToken: TOKEN, userId: USER_ID });
      expect(mocks.getProjectByPublicToken).toHaveBeenCalledWith({ token: TOKEN });
    });

    it("calls updateClient with clientId from project", async () => {
      await completeClientSignUp({ inviteToken: TOKEN, userId: USER_ID });
      expect(mocks.updateClient).toHaveBeenCalledWith({
        id: CLIENT_ID,
        data: { clerkUserId: USER_ID, email: PRIMARY_EMAIL }
      });
    });

    it("still calls linkClientsByEmail after updateClient", async () => {
      await completeClientSignUp({ inviteToken: TOKEN, userId: USER_ID });
      expect(mocks.linkClientsByEmail).toHaveBeenCalledWith({
        email: PRIMARY_EMAIL,
        clerkUserId: USER_ID
      });
    });

    it("still returns success when updateClient fails — falls back to email linking", async () => {
      mocks.updateClient.mockResolvedValue([SupabaseServiceError.unknown(), null]);
      const result = await completeClientSignUp({ inviteToken: TOKEN, userId: USER_ID });
      expect(result).toEqual({ success: true, data: true });
      expect(mocks.linkClientsByEmail).toHaveBeenCalled();
    });
  });

  describe("with invalid invite token — project not found", () => {
    const TOKEN = "bad-token";

    beforeEach(() => {
      mocks.getProjectByPublicToken.mockResolvedValue([SupabaseServiceError.notFound("Project"), null]);
    });

    it("returns success despite token resolution failure", async () => {
      const result = await completeClientSignUp({ inviteToken: TOKEN, userId: USER_ID });
      expect(result).toEqual({ success: true, data: true });
    });

    it("does not call updateClient when project is not found", async () => {
      await completeClientSignUp({ inviteToken: TOKEN, userId: USER_ID });
      expect(mocks.updateClient).not.toHaveBeenCalled();
    });

    it("still calls linkClientsByEmail as fallback", async () => {
      await completeClientSignUp({ inviteToken: TOKEN, userId: USER_ID });
      expect(mocks.linkClientsByEmail).toHaveBeenCalledWith({
        email: PRIMARY_EMAIL,
        clerkUserId: USER_ID
      });
    });
  });
});

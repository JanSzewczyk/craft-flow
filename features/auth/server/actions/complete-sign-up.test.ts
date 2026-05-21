const mocks = vi.hoisted(() => ({
  setUserMetadata: vi.fn()
}));

vi.mock("../api/set-user-metadata", () => ({ setUserMetadata: mocks.setUserMetadata }));

import { ClerkServiceError } from "~/lib/clerk/errors";

import { completeSignUp } from "./complete-sign-up";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("completeSignUp", () => {
  describe("validation", () => {
    it("returns error when userId is empty string", async () => {
      const result = await completeSignUp("");
      expect(result).toEqual({ success: false, error: "Invalid user ID provided." });
      expect(mocks.setUserMetadata).not.toHaveBeenCalled();
    });

    it("returns error when userId is whitespace", async () => {
      const result = await completeSignUp("   ");
      expect(result).toEqual({ success: false, error: "Invalid user ID provided." });
      expect(mocks.setUserMetadata).not.toHaveBeenCalled();
    });
  });

  describe("service failure", () => {
    it("returns Polish error message when setUserMetadata fails with unknown error", async () => {
      mocks.setUserMetadata.mockResolvedValue([ClerkServiceError.unknown(), null]);
      const result = await completeSignUp("user-123");
      expect(result).toEqual({
        success: false,
        error: "Nie udało się dokończyć rejestracji. Spróbuj ponownie później."
      });
    });

    it("returns Polish error message when setUserMetadata fails with network error", async () => {
      mocks.setUserMetadata.mockResolvedValue([ClerkServiceError.network(), null]);
      const result = await completeSignUp("user-123");
      expect(result).toEqual({
        success: false,
        error: "Nie udało się dokończyć rejestracji. Spróbuj ponownie później."
      });
    });

    it("returns Polish error message when setUserMetadata fails with unauthorized error", async () => {
      mocks.setUserMetadata.mockResolvedValue([ClerkServiceError.unauthorized(), null]);
      const result = await completeSignUp("user-123");
      expect(result).toEqual({
        success: false,
        error: "Nie udało się dokończyć rejestracji. Spróbuj ponownie później."
      });
    });
  });

  describe("success", () => {
    it("returns success with data true when setUserMetadata succeeds", async () => {
      mocks.setUserMetadata.mockResolvedValue([null, undefined]);
      const result = await completeSignUp("user-123");
      expect(result).toEqual({ success: true, data: true });
    });

    it("calls setUserMetadata with CONTRACTOR role and onboardingComplete false", async () => {
      mocks.setUserMetadata.mockResolvedValue([null, undefined]);
      await completeSignUp("user-123");
      expect(mocks.setUserMetadata).toHaveBeenCalledWith("user-123", {
        roles: ["CONTRACTOR"],
        onboardingComplete: false
      });
    });

    it("passes the given userId to setUserMetadata", async () => {
      mocks.setUserMetadata.mockResolvedValue([null, undefined]);
      await completeSignUp("clerk_user_abc");
      expect(mocks.setUserMetadata).toHaveBeenCalledWith("clerk_user_abc", expect.any(Object));
    });
  });
});

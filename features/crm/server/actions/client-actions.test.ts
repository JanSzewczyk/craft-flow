const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  revalidatePath: vi.fn(),
  createClient: vi.fn(),
  updateClient: vi.fn(),
  deleteClient: vi.fn()
}));

vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("~/features/crm/server/services/clients.service", () => ({
  createClient: mocks.createClient,
  updateClient: mocks.updateClient,
  deleteClient: mocks.deleteClient
}));

import { clientBuilder, clientFormBuilder } from "~/features/crm/test/builders";
import { SupabaseServiceError } from "~/lib/supabase/errors";

import { createClientAction } from "./create-client.action";
import { deleteClientAction } from "./delete-client.action";
import { updateClientAction } from "./update-client.action";

const AUTHENTICATED = { isAuthenticated: true, userId: "user-1" };
const UNAUTHENTICATED = { isAuthenticated: false, userId: null };

const clientData = clientFormBuilder.one();
const mockClient = clientBuilder.one({ overrides: { contractorId: "contractor-1" } });

beforeEach(() => {
  vi.resetAllMocks();
  mocks.auth.mockResolvedValue(AUTHENTICATED);
});

// ─── createClientAction ───────────────────────────────────────────────────────

describe("createClientAction", () => {
  test("returns error when unauthenticated", async () => {
    mocks.auth.mockResolvedValue(UNAUTHENTICATED);
    const result = await createClientAction(clientData);
    expect(result).toEqual({ success: false, error: "Nie jesteś zalogowany" });
    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  test("returns error when service fails with unknown error", async () => {
    mocks.createClient.mockResolvedValue([SupabaseServiceError.unknown(), null]);
    const result = await createClientAction(clientData);
    expect(result).toEqual({ success: false, error: "Wystąpił błąd serwera. Spróbuj ponownie." });
  });

  test("returns error when service fails with already_exists", async () => {
    mocks.createClient.mockResolvedValue([SupabaseServiceError.alreadyExists("Client"), null]);
    const result = await createClientAction(clientData);
    expect(result).toEqual({ success: false, error: "Klient o tym adresie e-mail już istnieje" });
  });

  test("returns error when permission denied", async () => {
    mocks.createClient.mockResolvedValue([SupabaseServiceError.unauthorized(), null]);
    const result = await createClientAction(clientData);
    expect(result).toEqual({ success: false, error: "Brak uprawnień" });
  });

  test("revalidates path and returns success on success", async () => {
    mocks.createClient.mockResolvedValue([null, mockClient]);
    const result = await createClientAction(clientData);
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/app/clients");
    expect(result).toEqual({ success: true, data: mockClient, message: "Klient został dodany" });
  });

  test("calls service with correct userId and data", async () => {
    mocks.createClient.mockResolvedValue([null, mockClient]);
    await createClientAction(clientData);
    expect(mocks.createClient).toHaveBeenCalledWith("user-1", clientData);
  });
});

// ─── updateClientAction ───────────────────────────────────────────────────────

describe("updateClientAction", () => {
  test("returns error when unauthenticated", async () => {
    mocks.auth.mockResolvedValue(UNAUTHENTICATED);
    const result = await updateClientAction("client-1", clientData);
    expect(result).toEqual({ success: false, error: "Nie jesteś zalogowany" });
    expect(mocks.updateClient).not.toHaveBeenCalled();
  });

  test("returns error when client not found", async () => {
    mocks.updateClient.mockResolvedValue([SupabaseServiceError.notFound("Client"), null]);
    const result = await updateClientAction("client-1", clientData);
    expect(result).toEqual({ success: false, error: "Klient nie istnieje" });
  });

  test("returns error when permission denied", async () => {
    mocks.updateClient.mockResolvedValue([SupabaseServiceError.unauthorized(), null]);
    const result = await updateClientAction("client-1", clientData);
    expect(result).toEqual({ success: false, error: "Brak uprawnień" });
  });

  test("returns error when attempting to change email of registered client", async () => {
    mocks.updateClient.mockResolvedValue([
      SupabaseServiceError.validation("Cannot change email of registered client"),
      null
    ]);
    const result = await updateClientAction("client-1", clientData);
    expect(result).toEqual({ success: false, error: "Nie można edytować adresu e-mail zarejestrowanego klienta" });
  });

  test("revalidates path and returns success on success", async () => {
    mocks.updateClient.mockResolvedValue([null, mockClient]);
    const result = await updateClientAction("client-1", clientData);
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/app/clients");
    expect(result).toEqual({ success: true, data: mockClient, message: "Dane klienta zostały zaktualizowane" });
  });

  test("calls service with correct userId, id and data", async () => {
    mocks.updateClient.mockResolvedValue([null, mockClient]);
    await updateClientAction("client-1", clientData);
    expect(mocks.updateClient).toHaveBeenCalledWith("user-1", "client-1", clientData);
  });
});

// ─── deleteClientAction ───────────────────────────────────────────────────────

describe("deleteClientAction", () => {
  test("returns error when unauthenticated", async () => {
    mocks.auth.mockResolvedValue(UNAUTHENTICATED);
    const result = await deleteClientAction("client-1");
    expect(result).toEqual({ success: false, error: "Nie jesteś zalogowany" });
    expect(mocks.deleteClient).not.toHaveBeenCalled();
  });

  test("returns error when permission denied", async () => {
    mocks.deleteClient.mockResolvedValue([SupabaseServiceError.unauthorized(), null]);
    const result = await deleteClientAction("client-1");
    expect(result).toEqual({ success: false, error: "Brak uprawnień" });
  });

  test("returns error when client has associated projects", async () => {
    const fkError = new SupabaseServiceError({
      code: "fk_constraint",
      message: "Client has associated projects",
      isRetryable: false
    });
    mocks.deleteClient.mockResolvedValue([fkError, null]);
    const result = await deleteClientAction("client-1");
    expect(result).toEqual({
      success: false,
      error:
        "Nie możesz usunąć tego klienta, ponieważ posiada on przypisane projekty. Najpierw usuń lub zarchiwizuj jego projekty."
    });
  });

  test("revalidates path and returns success on success", async () => {
    mocks.deleteClient.mockResolvedValue([null, { id: "client-1" }]);
    const result = await deleteClientAction("client-1");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/app/clients");
    expect(result).toEqual({ success: true, data: { id: "client-1" }, message: "Klient został usunięty" });
  });

  test("calls service with correct userId and id", async () => {
    mocks.deleteClient.mockResolvedValue([null, { id: "client-1" }]);
    await deleteClientAction("client-1");
    expect(mocks.deleteClient).toHaveBeenCalledWith("user-1", "client-1");
  });
});

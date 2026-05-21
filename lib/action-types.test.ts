import { isActionFailed, isActionSuccess } from "./action-types";

describe("isActionSuccess", () => {
  test("returns true for successful result", () => {
    const result = { success: true as const, data: { id: "1" } };
    expect(isActionSuccess(result)).toBe(true);
  });

  test("returns true for successful result with message", () => {
    const result = { success: true as const, data: "value", message: "Sukces" };
    expect(isActionSuccess(result)).toBe(true);
  });

  test("returns true for successful result with undefined data", () => {
    const result = { success: true as const, data: undefined };
    expect(isActionSuccess(result)).toBe(true);
  });

  test("returns false for failed result", () => {
    const result = { success: false as const, error: "Błąd" };
    expect(isActionSuccess(result)).toBe(false);
  });

  test("returns false for failed result with fieldErrors", () => {
    const result = { success: false as const, error: "Błąd", fieldErrors: { name: ["Wymagane"] } };
    expect(isActionSuccess(result)).toBe(false);
  });
});

describe("isActionFailed", () => {
  test("returns true for failed result", () => {
    const result = { success: false as const, error: "Coś poszło nie tak" };
    expect(isActionFailed(result)).toBe(true);
  });

  test("returns true for failed result with fieldErrors", () => {
    const result = { success: false as const, error: "Błąd walidacji", fieldErrors: { email: ["Niepoprawny format"] } };
    expect(isActionFailed(result)).toBe(true);
  });

  test("returns false for successful result", () => {
    const result = { success: true as const, data: null };
    expect(isActionFailed(result)).toBe(false);
  });

  test("returns false for successful result with data", () => {
    const result = { success: true as const, data: { id: "abc" }, message: "Zapisano" };
    expect(isActionFailed(result)).toBe(false);
  });
});

describe("isActionSuccess and isActionFailed are complementary", () => {
  test("success result: isActionSuccess true, isActionFailed false", () => {
    const result = { success: true as const, data: 42 };
    expect(isActionSuccess(result)).toBe(true);
    expect(isActionFailed(result)).toBe(false);
  });

  test("failed result: isActionFailed true, isActionSuccess false", () => {
    const result = { success: false as const, error: "Błąd" };
    expect(isActionFailed(result)).toBe(true);
    expect(isActionSuccess(result)).toBe(false);
  });
});

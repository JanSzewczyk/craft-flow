import { parseSearchParams } from "./search-params";

describe("parseSearchParams", () => {
  describe("search parameter", () => {
    test("trims whitespace from raw.search", () => {
      const result = parseSearchParams({ search: "  hello world  " });
      expect(result.search).toBe("hello world");
    });

    test("returns empty string when raw.search is missing", () => {
      const result = parseSearchParams({});
      expect(result.search).toBe("");
    });

    test("returns empty string when raw.search is not a string (array)", () => {
      const result = parseSearchParams({ search: ["hello", "world"] });
      expect(result.search).toBe("");
    });

    test("returns empty string when raw.search is undefined", () => {
      const result = parseSearchParams({ search: undefined });
      expect(result.search).toBe("");
    });
  });

  describe("page parameter", () => {
    test("defaults to page 1 when raw.page is missing", () => {
      const result = parseSearchParams({});
      expect(result.page).toBe(1);
    });

    test("defaults to page 1 when raw.page is not a string (array)", () => {
      const result = parseSearchParams({ page: ["2", "3"] });
      expect(result.page).toBe(1);
    });

    test("falls back to page 1 for non-numeric raw.page string", () => {
      const result = parseSearchParams({ page: "abc" });
      expect(result.page).toBe(1);
    });

    test("falls back to page 1 for negative raw.page string", () => {
      const result = parseSearchParams({ page: "-5" });
      expect(result.page).toBe(1);
    });

    test("falls back to page 1 for zero raw.page string", () => {
      const result = parseSearchParams({ page: "0" });
      expect(result.page).toBe(1);
    });

    test("parses valid numeric raw.page string correctly", () => {
      const result = parseSearchParams({ page: "5" });
      expect(result.page).toBe(5);
    });

    test("parses page 1 correctly", () => {
      const result = parseSearchParams({ page: "1" });
      expect(result.page).toBe(1);
    });

    test("parses large page numbers correctly", () => {
      const result = parseSearchParams({ page: "999" });
      expect(result.page).toBe(999);
    });
  });

  describe("combined parameters", () => {
    test("parses both valid search and page together", () => {
      const result = parseSearchParams({ search: "  test query  ", page: "3" });
      expect(result).toEqual({ search: "test query", page: 3 });
    });

    test("returns default page with trimmed search", () => {
      const result = parseSearchParams({ search: "  hello  " });
      expect(result).toEqual({ search: "hello", page: 1 });
    });

    test("parses valid page with missing search", () => {
      const result = parseSearchParams({ page: "2" });
      expect(result).toEqual({ search: "", page: 2 });
    });

    test("handles all parameters invalid or missing", () => {
      const result = parseSearchParams({});
      expect(result).toEqual({ search: "", page: 1 });
    });
  });
});

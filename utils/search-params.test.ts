import { describe, it, expect } from "vitest";
import { parseSearchParams } from "./search-params";

describe("parseSearchParams", () => {
  describe("happy path", () => {
    it("should parse valid search and page parameters", () => {
      const result = parseSearchParams({ search: "test query", page: "2" });
      expect(result).toEqual({ search: "test query", page: 2 });
    });

    it("should parse search with multiple words", () => {
      const result = parseSearchParams({
        search: "multiple word search query",
        page: "5",
      });
      expect(result).toEqual({ search: "multiple word search query", page: 5 });
    });

    it("should parse page 1", () => {
      const result = parseSearchParams({ search: "test", page: "1" });
      expect(result).toEqual({ search: "test", page: 1 });
    });

    it("should parse large page numbers", () => {
      const result = parseSearchParams({ search: "test", page: "100" });
      expect(result).toEqual({ search: "test", page: 100 });
    });
  });

  describe("search value handling", () => {
    it("should trim whitespace from search", () => {
      const result = parseSearchParams({ search: "  test query  " });
      expect(result).toEqual({ search: "test query", page: 1 });
    });

    it("should trim leading and trailing whitespace", () => {
      const result = parseSearchParams({ search: "  test  " });
      expect(result).toEqual({ search: "test", page: 1 });
    });

    it("should trim tabs and newlines from search", () => {
      const result = parseSearchParams({ search: "\t\ntest\n\t" });
      expect(result).toEqual({ search: "test", page: 1 });
    });

    it("should default to empty string when search is missing", () => {
      const result = parseSearchParams({ page: "1" });
      expect(result).toEqual({ search: "", page: 1 });
    });

    it("should default to empty string when search is undefined", () => {
      const result = parseSearchParams({ search: undefined, page: "1" });
      expect(result).toEqual({ search: "", page: 1 });
    });

    it("should default to empty string when search is an array", () => {
      const result = parseSearchParams({ search: ["test", "array"], page: "1" });
      expect(result).toEqual({ search: "", page: 1 });
    });

    it("should preserve internal whitespace in search", () => {
      const result = parseSearchParams({
        search: "  test   query   value  ",
      });
      expect(result).toEqual({ search: "test   query   value", page: 1 });
    });

    it("should handle empty search string", () => {
      const result = parseSearchParams({ search: "" });
      expect(result).toEqual({ search: "", page: 1 });
    });

    it("should handle search with only whitespace", () => {
      const result = parseSearchParams({ search: "   " });
      expect(result).toEqual({ search: "", page: 1 });
    });
  });

  describe("page parameter handling", () => {
    it("should default to 1 when page is missing", () => {
      const result = parseSearchParams({ search: "test" });
      expect(result).toEqual({ search: "test", page: 1 });
    });

    it("should default to 1 when page is undefined", () => {
      const result = parseSearchParams({ search: "test", page: undefined });
      expect(result).toEqual({ search: "test", page: 1 });
    });

    it("should default to 1 when page is an array", () => {
      const result = parseSearchParams({ search: "test", page: ["1", "2"] });
      expect(result).toEqual({ search: "test", page: 1 });
    });

    it("should default to 1 when page is less than 1", () => {
      const result = parseSearchParams({ search: "test", page: "0" });
      expect(result).toEqual({ search: "test", page: 1 });
    });

    it("should default to 1 when page is negative", () => {
      const result = parseSearchParams({ search: "test", page: "-5" });
      expect(result).toEqual({ search: "test", page: 1 });
    });

    it("should default to 1 when page is not a valid number", () => {
      const result = parseSearchParams({ search: "test", page: "not-a-number" });
      expect(result).toEqual({ search: "test", page: 1 });
    });

    it("should truncate float strings to integers", () => {
      const result = parseSearchParams({ search: "test", page: "2.5" });
      expect(result).toEqual({ search: "test", page: 2 });
    });

    it("should default to 1 when page is NaN", () => {
      const result = parseSearchParams({ search: "test", page: "NaN" });
      expect(result).toEqual({ search: "test", page: 1 });
    });

    it("should default to 1 when page is Infinity", () => {
      const result = parseSearchParams({
        search: "test",
        page: "Infinity",
      });
      expect(result).toEqual({ search: "test", page: 1 });
    });

    it("should default to 1 when page is -Infinity", () => {
      const result = parseSearchParams({
        search: "test",
        page: "-Infinity",
      });
      expect(result).toEqual({ search: "test", page: 1 });
    });

    it("should handle whitespace in page string", () => {
      const result = parseSearchParams({ search: "test", page: "  2  " });
      expect(result).toEqual({ search: "test", page: 2 });
    });
  });

  describe("edge cases", () => {
    it("should handle empty object", () => {
      const result = parseSearchParams({});
      expect(result).toEqual({ search: "", page: 1 });
    });

    it("should handle both search and page missing", () => {
      const result = parseSearchParams({});
      expect(result).toEqual({ search: "", page: 1 });
    });

    it("should ignore extra properties", () => {
      const result = parseSearchParams({
        search: "test",
        page: "2",
        extra: "ignored",
      } as Record<string, string | string[] | undefined>);
      expect(result).toEqual({ search: "test", page: 2 });
    });

    it("should handle special characters in search", () => {
      const result = parseSearchParams({
        search: "  test@#$%^&*()  ",
      });
      expect(result).toEqual({ search: "test@#$%^&*()", page: 1 });
    });

    it("should handle unicode characters in search", () => {
      const result = parseSearchParams({
        search: "  żółw testowy  ",
      });
      expect(result).toEqual({ search: "żółw testowy", page: 1 });
    });
  });
});

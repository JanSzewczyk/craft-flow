import { describe, test, expect } from "vitest";
import { getInitials } from "./users";

describe("getInitials", () => {
  describe("standard cases", () => {
    test("returns initials for a normal two-word name", () => {
      expect(getInitials("John Doe")).toBe("JD");
    });

    test("returns initial for a single-word name", () => {
      expect(getInitials("Alice")).toBe("A");
    });

    test("takes only first two initials for names with three or more words", () => {
      expect(getInitials("John Paul Smith")).toBe("JP");
    });
  });

  describe("whitespace handling", () => {
    test("handles names with extra whitespace between words", () => {
      expect(getInitials("John  Doe")).toBe("JD");
    });

    test("handles names with multiple leading/trailing spaces", () => {
      expect(getInitials("  Jane Smith  ")).toBe("JS");
    });

    test("returns empty string for an empty input", () => {
      expect(getInitials("")).toBe("");
    });

    test("handles names with only spaces", () => {
      expect(getInitials("   ")).toBe("");
    });
  });

  describe("case normalization", () => {
    test("converts lowercase names to uppercase initials", () => {
      expect(getInitials("john doe")).toBe("JD");
    });

    test("handles mixed case names", () => {
      expect(getInitials("jOhN dOe")).toBe("JD");
    });
  });

  describe("edge cases", () => {
    test("handles single character names", () => {
      expect(getInitials("A B")).toBe("AB");
    });
  });
});

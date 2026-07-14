import { describe, it, expect } from "vitest";
import { getInitials } from "./users";

describe("getInitials", () => {
  it("returns initials for a normal two-word name", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("returns initial for a single-word name", () => {
    expect(getInitials("Alice")).toBe("A");
  });

  it("returns empty string for an empty input", () => {
    expect(getInitials("")).toBe("");
  });

  it("handles names with extra whitespace between words", () => {
    expect(getInitials("John  Doe")).toBe("JD");
  });

  it("handles names with multiple leading/trailing spaces", () => {
    expect(getInitials("  Jane Smith  ")).toBe("JS");
  });

  it("takes only first two initials for names with three or more words", () => {
    expect(getInitials("John Paul Smith")).toBe("JP");
  });

  it("converts lowercase names to uppercase initials", () => {
    expect(getInitials("john doe")).toBe("JD");
  });

  it("handles mixed case names", () => {
    expect(getInitials("jOhN dOe")).toBe("JD");
  });

  it("handles single character names", () => {
    expect(getInitials("A B")).toBe("AB");
  });

  it("handles names with only spaces", () => {
    expect(getInitials("   ")).toBe("");
  });
});

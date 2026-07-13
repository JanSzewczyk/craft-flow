import { getInitials } from "./users";

describe("getInitials", () => {
  test("returns first letters of first two words uppercased", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  test("handles single word by returning first letter uppercased", () => {
    expect(getInitials("John")).toBe("J");
  });

  test("handles extra internal whitespace between words", () => {
    expect(getInitials("John   Doe")).toBe("JD");
    expect(getInitials("Alice    Smith")).toBe("AS");
  });

  test("returns empty string for empty input", () => {
    expect(getInitials("")).toBe("");
  });

  test("ignores words beyond the first two", () => {
    expect(getInitials("John Michael Doe")).toBe("JM");
  });

  test("handles names with only whitespace", () => {
    expect(getInitials("   ")).toBe("");
  });

  test("uppercases lowercase names", () => {
    expect(getInitials("jane doe")).toBe("JD");
  });

  test("uppercases mixed case names", () => {
    expect(getInitials("jOhN dOe")).toBe("JD");
  });
});

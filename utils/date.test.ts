import { formatDate } from "./date";

describe("formatDate", () => {
  test("formats date with 2-digit day, 2-digit month, 4-digit year", () => {
    const date = new Date("2026-07-14");
    expect(formatDate(date)).toBe("14.07.2026");
  });

  test("pads single digit day and month with leading zeros", () => {
    const date = new Date("2026-03-09");
    expect(formatDate(date)).toBe("09.03.2026");
  });

  test("formats leap year date", () => {
    const date = new Date(2024, 1, 29);
    expect(formatDate(date)).toBe("29.02.2024");
  });

  test("formats January 1st", () => {
    const date = new Date("2025-01-01");
    expect(formatDate(date)).toBe("01.01.2025");
  });

  test("formats December 31st", () => {
    const date = new Date("2025-12-31");
    expect(formatDate(date)).toBe("31.12.2025");
  });
});

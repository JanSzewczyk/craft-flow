import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatRelativeTime, formatDate, formatDateTime } from "./date";

describe("formatRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("just-under and just-over minute boundaries", () => {
    it("should return 'Przed chwilą' for 0 seconds", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-07-14T10:00:00Z");
      expect(formatRelativeTime(pastDate)).toBe("Przed chwilą");
    });

    it("should return 'Przed chwilą' for 59 seconds", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-07-14T09:59:01Z");
      expect(formatRelativeTime(pastDate)).toBe("Przed chwilą");
    });

    it("should return '1 min temu' for 60 seconds (just over 1 minute)", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-07-14T09:59:00Z");
      expect(formatRelativeTime(pastDate)).toBe("1 min temu");
    });
  });

  describe("minute range boundaries", () => {
    it("should return '1 min temu' for 1 minute", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-07-14T09:59:00Z");
      expect(formatRelativeTime(pastDate)).toBe("1 min temu");
    });

    it("should return '30 min temu' for 30 minutes", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-07-14T09:30:00Z");
      expect(formatRelativeTime(pastDate)).toBe("30 min temu");
    });

    it("should return '59 min temu' for 59 minutes (just under 1 hour)", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-07-14T09:01:00Z");
      expect(formatRelativeTime(pastDate)).toBe("59 min temu");
    });

    it("should return '59 min temu' for just under 60 minutes", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-07-14T09:01:01Z");
      expect(formatRelativeTime(pastDate)).toBe("59 min temu");
    });
  });

  describe("hour range boundaries", () => {
    it("should return '1 godz. temu' for 60 minutes (1 hour)", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-07-14T09:00:00Z");
      expect(formatRelativeTime(pastDate)).toBe("1 godz. temu");
    });

    it("should return '3 godz. temu' for 3 hours", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-07-14T07:00:00Z");
      expect(formatRelativeTime(pastDate)).toBe("3 godz. temu");
    });

    it("should return '23 godz. temu' for 23 hours 59 minutes (just under 24 hours)", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-07-13T10:01:00Z");
      expect(formatRelativeTime(pastDate)).toBe("23 godz. temu");
    });

    it("should return '23 godz. temu' for just under 24 hours", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-07-13T10:01:01Z");
      expect(formatRelativeTime(pastDate)).toBe("23 godz. temu");
    });
  });

  describe("day range boundaries", () => {
    it("should return '1 dn. temu' for 24 hours (1 day)", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-07-13T10:00:00Z");
      expect(formatRelativeTime(pastDate)).toBe("1 dn. temu");
    });

    it("should return '2 dn. temu' for 2 days", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-07-12T10:00:00Z");
      expect(formatRelativeTime(pastDate)).toBe("2 dn. temu");
    });

    it("should return '6 dn. temu' for 6 days (just under 7 days)", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-07-08T10:00:00Z");
      expect(formatRelativeTime(pastDate)).toBe("6 dn. temu");
    });

    it("should return '6 dn. temu' for just under 7 days", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-07-08T10:00:01Z");
      expect(formatRelativeTime(pastDate)).toBe("6 dn. temu");
    });
  });

  describe("future dates", () => {
    it("should return 'Przed chwilą' for a few seconds in the future", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const futureDate = new Date("2026-07-14T10:00:05Z");
      expect(formatRelativeTime(futureDate)).toBe("Przed chwilą");
    });

    it("should return 'Przed chwilą' for a few minutes in the future", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const futureDate = new Date("2026-07-14T10:05:00Z");
      expect(formatRelativeTime(futureDate)).toBe("Przed chwilą");
    });

    it("should return 'Przed chwilą' for several hours in the future", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const futureDate = new Date("2026-07-14T15:00:00Z");
      expect(formatRelativeTime(futureDate)).toBe("Przed chwilą");
    });

    it("should return 'Przed chwilą' for a day in the future", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const futureDate = new Date("2026-07-15T10:00:00Z");
      expect(formatRelativeTime(futureDate)).toBe("Przed chwilą");
    });
  });

  describe("day-month fallback (7+ days)", () => {
    it("should treat exactly 7 days ago as the dd MMM fallback branch", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-07-07T10:00:00Z");
      expect(formatRelativeTime(pastDate)).toBe("7 lip");
    });

    it("should return 'day month' format for 30 days ago", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-06-14T10:00:00Z");
      expect(formatRelativeTime(pastDate)).toBe("14 cze");
    });

    it("should return 'day month' format for 365 days ago", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2025-07-14T10:00:00Z");
      expect(formatRelativeTime(pastDate)).toBe("14 lip");
    });

    it("should handle single-digit days in day-month format", () => {
      const now = new Date("2026-07-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-07-01T10:00:00Z");
      expect(formatRelativeTime(pastDate)).toBe("1 lip");
    });

    it("should handle January month abbreviation", () => {
      const now = new Date("2026-02-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-01-14T10:00:00Z");
      expect(formatRelativeTime(pastDate)).toBe("14 sty");
    });

    it("should handle December month abbreviation", () => {
      const now = new Date("2026-01-14T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2025-12-14T10:00:00Z");
      expect(formatRelativeTime(pastDate)).toBe("14 gru");
    });
  });

  describe("edge cases for formatRelativeTime", () => {
    it("should handle dates at month boundaries", () => {
      const now = new Date("2026-08-01T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2026-07-31T10:00:00Z");
      expect(formatRelativeTime(pastDate)).toBe("1 dn. temu");
    });

    it("should handle dates at year boundaries", () => {
      const now = new Date("2026-01-01T10:00:00Z");
      vi.setSystemTime(now);
      const pastDate = new Date("2025-12-31T10:00:00Z");
      expect(formatRelativeTime(pastDate)).toBe("1 dn. temu");
    });
  });
});

describe("formatDate", () => {
  it("should format a regular date with zero-padded day and month", () => {
    const date = new Date("2026-07-14T10:30:00Z");
    expect(formatDate(date)).toBe("14/07/2026");
  });

  it("should zero-pad single-digit days", () => {
    const date = new Date("2026-07-01T10:30:00Z");
    expect(formatDate(date)).toBe("01/07/2026");
  });

  it("should zero-pad single-digit months", () => {
    const date = new Date("2026-01-14T10:30:00Z");
    expect(formatDate(date)).toBe("14/01/2026");
  });

  it("should zero-pad both single-digit day and month", () => {
    const date = new Date("2026-01-01T10:30:00Z");
    expect(formatDate(date)).toBe("01/01/2026");
  });

  it("should format January 1st correctly", () => {
    const date = new Date("2026-01-01T00:00:00Z");
    expect(formatDate(date)).toBe("01/01/2026");
  });

  it("should format December 31st correctly", () => {
    const date = new Date("2026-12-31T23:59:59Z");
    expect(formatDate(date)).toBe("31/12/2026");
  });

  it("should format mid-month date correctly", () => {
    const date = new Date("2026-03-15T14:22:30Z");
    expect(formatDate(date)).toBe("15/03/2026");
  });

  it("should ignore time component", () => {
    const date1 = new Date("2026-07-14T00:00:00Z");
    const date2 = new Date("2026-07-14T23:59:59Z");
    expect(formatDate(date1)).toBe(formatDate(date2));
  });

  it("should handle leap year dates", () => {
    const date = new Date("2024-02-29T10:30:00Z");
    expect(formatDate(date)).toBe("29/02/2024");
  });
});

describe("formatDateTime", () => {
  it("should format a regular datetime with zero-padded components", () => {
    const date = new Date("2026-07-14T14:30:00Z");
    expect(formatDateTime(date)).toBe("14/07/2026 14:30");
  });

  it("should zero-pad single-digit days", () => {
    const date = new Date("2026-07-01T14:30:00Z");
    expect(formatDateTime(date)).toBe("01/07/2026 14:30");
  });

  it("should zero-pad single-digit months", () => {
    const date = new Date("2026-01-14T14:30:00Z");
    expect(formatDateTime(date)).toBe("14/01/2026 14:30");
  });

  it("should zero-pad single-digit hours", () => {
    const date = new Date("2026-07-14T07:30:00Z");
    expect(formatDateTime(date)).toBe("14/07/2026 07:30");
  });

  it("should zero-pad single-digit minutes", () => {
    const date = new Date("2026-07-14T14:05:00Z");
    expect(formatDateTime(date)).toBe("14/07/2026 14:05");
  });

  it("should format midnight (00:00)", () => {
    const date = new Date("2026-07-14T00:00:00Z");
    expect(formatDateTime(date)).toBe("14/07/2026 00:00");
  });

  it("should format 23:59", () => {
    const date = new Date("2026-07-14T23:59:00Z");
    expect(formatDateTime(date)).toBe("14/07/2026 23:59");
  });

  it("should format January 1st at midnight", () => {
    const date = new Date("2026-01-01T00:00:00Z");
    expect(formatDateTime(date)).toBe("01/01/2026 00:00");
  });

  it("should format December 31st at 23:59", () => {
    const date = new Date("2026-12-31T23:59:00Z");
    expect(formatDateTime(date)).toBe("31/12/2026 23:59");
  });

  it("should zero-pad all single-digit components together", () => {
    const date = new Date("2026-01-01T01:01:00Z");
    expect(formatDateTime(date)).toBe("01/01/2026 01:01");
  });

  it("should ignore seconds", () => {
    const date1 = new Date("2026-07-14T14:30:15Z");
    const date2 = new Date("2026-07-14T14:30:45Z");
    expect(formatDateTime(date1)).toBe(formatDateTime(date2));
  });

  it("should handle leap year dates with time", () => {
    const date = new Date("2024-02-29T15:45:00Z");
    expect(formatDateTime(date)).toBe("29/02/2024 15:45");
  });

  it("should format typical work hours", () => {
    const date = new Date("2026-07-14T09:00:00Z");
    expect(formatDateTime(date)).toBe("14/07/2026 09:00");
  });

  it("should format afternoon time", () => {
    const date = new Date("2026-07-14T16:45:00Z");
    expect(formatDateTime(date)).toBe("14/07/2026 16:45");
  });
});

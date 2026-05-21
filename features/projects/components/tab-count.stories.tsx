import { vi } from "vitest";

import { expect } from "storybook/test";

import preview from "~/.storybook/preview";

vi.mock("~/features/projects/server/services/projects-list.service", () => ({
  getCachedProjectStatusCounts: vi
    .fn()
    .mockResolvedValue([null, { DRAFT: 3, ACTIVE: 5, COMPLETED: 2, ARCHIVED: 1, ALL: 11 }])
}));

import { TabCount } from "./tab-count";

/*
 * Test plan:
 * 1. DraftCount — status="DRAFT", count=3
 *    - Renders badge with count 3
 * 2. ActiveCount — status="ACTIVE", count=5
 *    - Renders badge with count 5
 * 3. ZeroCount — service returns 0 for requested status
 *    - Renders nothing (returns null)
 *
 * NOTE: TabCount is an async Server Component. If async RSC rendering is not
 * supported in this Storybook setup, stories are provided as visual stubs
 * without interaction tests.
 */

const meta = preview.meta({
  title: "Features/Projects/Tab Count",
  component: TabCount,
  parameters: {
    layout: "centered"
  }
});

export const DraftCount = meta.story({
  args: {
    userId: "user-1",
    status: "DRAFT"
  }
});

DraftCount.test("Renders badge with draft count", async ({ canvas }) => {
  await expect(canvas.getByText("3")).toBeVisible();
});

export const ActiveCount = meta.story({
  args: {
    userId: "user-1",
    status: "ACTIVE"
  }
});

ActiveCount.test("Renders badge with active count", async ({ canvas }) => {
  await expect(canvas.getByText("5")).toBeVisible();
});

export const ZeroCount = meta.story({
  args: {
    userId: "user-1",
    status: "DRAFT"
  },
  beforeEach() {
    const { getCachedProjectStatusCounts } = vi.mocked(
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("~/features/projects/server/services/projects-list.service")
    );
    getCachedProjectStatusCounts.mockResolvedValueOnce([
      null,
      { DRAFT: 0, ACTIVE: 0, COMPLETED: 0, ARCHIVED: 0, ALL: 0 }
    ]);
  }
});

ZeroCount.test("Renders nothing when count is zero", async ({ canvas }) => {
  await expect(canvas.queryByRole("status")).not.toBeInTheDocument();
});

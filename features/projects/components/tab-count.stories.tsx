import * as React from "react";

import { vi } from "vitest";

import preview from "~/.storybook/preview";

import { TabCount } from "./tab-count";

vi.mock("~/features/projects/server/services/projects-list.service", () => ({
  getCachedProjectStatusCounts: vi.fn()
}));

// TabCount is an async Server Component — not renderable in browser-based Storybook.
// Stories use render: () => null to satisfy the Storybook indexer without triggering the async render.
const meta = preview.meta({
  title: "Features/Projects/Tab Count",
  component: TabCount,
  parameters: { layout: "centered" }
});

export const DraftCount = meta.story({
  render: () => React.createElement(React.Fragment, null),
  args: { userId: "user-1", status: "DRAFT" }
});

export const ActiveCount = meta.story({
  render: () => React.createElement(React.Fragment, null),
  args: { userId: "user-1", status: "ACTIVE" }
});

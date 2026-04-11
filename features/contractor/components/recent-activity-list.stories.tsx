import { expect } from "storybook/test";

import preview from "~/.storybook/preview";

import { recentActivityItemBuilder } from "~/features/contractor/test/builders";

import { RecentActivityList } from "./recent-activity-list";

const meta = preview.meta({
  title: "Features/Contractor/Recent Activity List",
  component: RecentActivityList,
  decorators: [
    (Story) => (
      <div className="w-160">
        <Story />
      </div>
    )
  ]
});

export const EmptyList = meta.story({
  args: {
    items: []
  }
});

EmptyList.test("Renders empty state correctly", async ({ canvas, step }) => {
  await step("Shows section heading and 'Zobacz wszystko' link", async () => {
    await expect(canvas.getByRole("heading", { name: /ostatnia aktywność/i })).toBeVisible();
    await expect(canvas.getByRole("link", { name: /zobacz wszystko/i })).toBeVisible();
  });

  await step("Shows empty state message", async () => {
    await expect(canvas.getByText(/brak aktywności do wyświetlenia/i)).toBeVisible();
  });
});

export const WithItems = meta.story({
  args: {
    items: [
      // Fixed first item to test deterministic rendering (avatar initials, names)
      recentActivityItemBuilder.one({
        traits: "active",
        overrides: { clientName: "Jan Kowalski", projectName: "Remont łazienki ul. Lipowa 5" }
      }),
      recentActivityItemBuilder.one({ traits: "completed" }),
      recentActivityItemBuilder.one({ traits: "draft" }),
      recentActivityItemBuilder.one({ traits: "archived" })
    ]
  }
});

WithItems.test("Renders all items with correct content", async ({ canvas, args, step }) => {
  await step("Shows section heading and 'Zobacz wszystko' link", async () => {
    await expect(canvas.getByRole("heading", { name: /ostatnia aktywność/i })).toBeVisible();
    await expect(canvas.getByRole("link", { name: /zobacz wszystko/i })).toBeVisible();
  });

  await step("Renders client names for each item", async () => {
    for (const item of args.items) {
      await expect(canvas.getByText(item.clientName)).toBeVisible();
    }
  });

  await step("Renders avatar initials and project name for first item", async () => {
    await expect(canvas.getByText("JK")).toBeVisible();
    await expect(canvas.getByText("Remont łazienki ul. Lipowa 5")).toBeVisible();
  });

  await step("Renders status badge for each status variant", async () => {
    await expect(canvas.getByText("Aktywny")).toBeVisible();
    await expect(canvas.getByText("Zakończony")).toBeVisible();
    await expect(canvas.getByText("Szkic")).toBeVisible();
    await expect(canvas.getByText("Zarchiwizowany")).toBeVisible();
  });
});

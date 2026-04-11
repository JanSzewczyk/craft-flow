import { expect } from "storybook/test";

import { Badge } from "@szum-tech/design-system";

import preview from "~/.storybook/preview";

import { ProjectsTabsNav } from "./projects-tabs-nav";

const meta = preview.meta({
  title: "Features/Projects/Projects Tabs Nav",
  component: ProjectsTabsNav,
  parameters: {
    layout: "padded",
    nextjs: {
      navigation: {
        pathname: "/app/projects"
      }
    }
  }
});

export const AllTab = meta.story({
  args: {
    activeTab: "ALL",
    countBadges: {}
  }
});

AllTab.test("Renders all tab labels", async ({ canvas, step }) => {
  await step("All status tabs are visible", async () => {
    await expect(canvas.getByText("Wszystkie")).toBeVisible();
    await expect(canvas.getByText("Szkice")).toBeVisible();
    await expect(canvas.getByText("Aktywne")).toBeVisible();
    await expect(canvas.getByText("Zakończone")).toBeVisible();
    await expect(canvas.getByText("Archiwum")).toBeVisible();
  });
});

export const DraftTab = meta.story({
  args: {
    activeTab: "DRAFT",
    countBadges: {}
  }
});

DraftTab.test("Renders with DRAFT tab active", async ({ canvas }) => {
  await expect(canvas.getByRole("tab", { name: "Szkice" })).toHaveAttribute("data-state", "active");
  await expect(canvas.getByRole("tab", { name: "Wszystkie" })).toHaveAttribute("data-state", "inactive");
});

export const WithCountBadges = meta.story({
  args: {
    activeTab: "ALL",
    countBadges: {
      ALL: <Badge variant="secondary">12</Badge>,
      ACTIVE: <Badge variant="secondary">5</Badge>,
      DRAFT: <Badge variant="secondary">3</Badge>
    }
  }
});

WithCountBadges.test("Renders count badges alongside tab labels", async ({ canvas, step }) => {
  await step("Tab labels are visible", async () => {
    await expect(canvas.getByText("Wszystkie")).toBeVisible();
    await expect(canvas.getByText("Aktywne")).toBeVisible();
  });

  await step("Count badges are visible", async () => {
    await expect(canvas.getByText("12")).toBeVisible();
    await expect(canvas.getByText("5")).toBeVisible();
    await expect(canvas.getByText("3")).toBeVisible();
  });
});

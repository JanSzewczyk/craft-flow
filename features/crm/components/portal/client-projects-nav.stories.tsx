import { expect } from "storybook/test";

import { ClientProjectsNav } from "./client-projects-nav";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/CRM/Portal/Client Projects Nav",
  component: ClientProjectsNav,
  parameters: {
    layout: "padded"
  }
});

export const ActiveTab = meta.story({
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/client"
      }
    }
  }
});

ActiveTab.test("Renders both tab labels", async ({ canvas }) => {
  await expect(canvas.getByRole("tab", { name: "Aktywne" })).toBeVisible();
  await expect(canvas.getByRole("tab", { name: "Historia" })).toBeVisible();
});

ActiveTab.test("Active tab is selected when on active path", async ({ canvas }) => {
  await expect(canvas.getByRole("tab", { name: "Aktywne" })).toHaveAttribute("data-state", "active");
  await expect(canvas.getByRole("tab", { name: "Historia" })).toHaveAttribute("data-state", "inactive");
});

export const HistoryTab = meta.story({
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/client/history"
      }
    }
  }
});

HistoryTab.test("History tab is selected when on history path", async ({ canvas }) => {
  await expect(canvas.getByRole("tab", { name: "Historia" })).toHaveAttribute("data-state", "active");
  await expect(canvas.getByRole("tab", { name: "Aktywne" })).toHaveAttribute("data-state", "inactive");
});

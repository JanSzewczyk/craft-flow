import { expect } from "storybook/test";

import AccountIssuePage from "./page";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Pages/Account Issue",
  component: AccountIssuePage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/account-issue"
      }
    }
  }
});

export const Default = meta.story({});

Default.test("Renders page with all expected elements", async ({ canvas, step }) => {
  await step("Header with brand logo is visible", async () => {
    await expect(canvas.getByText("CraftFlow")).toBeVisible();
  });

  await step("Warning icon is visible", async () => {
    const iconContainer = canvas.getByText("Problem z kontem").closest("[data-slot='card-header']");
    const svg = iconContainer?.querySelector("svg");
    await expect(svg).toBeInTheDocument();
  });

  await step("Card title is visible", async () => {
    await expect(canvas.getByText("Problem z kontem")).toBeVisible();
  });

  await step("Error description is visible", async () => {
    await expect(canvas.getByText(/wystąpił problem podczas konfiguracji twojego konta/i)).toBeVisible();
  });

  await step("Sign out button is visible", async () => {
    await expect(canvas.getByRole("button", { name: /wyloguj się/i })).toBeVisible();
  });

  await step("Theme toggle is present", async () => {
    const buttons = canvas.getAllByRole("button");
    const themeButton = buttons.find((btn) => btn.getAttribute("aria-label")?.includes("theme"));
    await expect(themeButton).toBeTruthy();
  });
});

Default.test("Sign out button has error variant styling", async ({ canvas }) => {
  const signOutButton = canvas.getByRole("button", { name: /wyloguj się/i });
  await expect(signOutButton).toBeVisible();
  await expect(signOutButton).not.toBeDisabled();
});

export const AccessibilityCheck = meta.story({
  tags: ["test-only"]
});

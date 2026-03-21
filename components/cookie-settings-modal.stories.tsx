import { expect, fn, waitFor } from "storybook/test";

import { CookieSettingsModal } from "./cookie-settings-modal";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Components/Cookie Settings Modal",
  component: CookieSettingsModal,
  args: {
    open: true,
    onOpenChange: fn(),
    onSave: fn(),
    onRejectOptional: fn()
  },
  parameters: {
    layout: "centered"
  }
});

export const DefaultPreferences = meta.story({});

// Content & Structure
DefaultPreferences.test("Renders all expected content", async ({ canvas }) => {
  await expect(canvas.getByRole("dialog")).toBeVisible();
  await expect(canvas.getByText("Niezbędne")).toBeVisible();
  await expect(canvas.getByText("Analityczne")).toBeVisible();
  await expect(canvas.getByText("Marketingowe")).toBeVisible();

  const switches = canvas.getAllByRole("switch");
  await expect(switches.length).toBe(3);

  const essentialSwitch = canvas.getByRole("switch", { name: "Niezbędne" });
  await expect(essentialSwitch).toHaveAttribute("aria-checked", "true");
  await expect(essentialSwitch).toBeDisabled();
});

// Interaction: Save
DefaultPreferences.test("Save button calls onSave with current preferences", async ({ canvas, userEvent, args }) => {
  const saveButton = canvas.getByRole("button", { name: "Zapisz preferencje" });
  await userEvent.click(saveButton);
  await expect(args.onSave).toHaveBeenCalledWith({ analytics: true, marketing: false });
});

// Interaction: Reject
DefaultPreferences.test("Reject button calls onRejectOptional", async ({ canvas, userEvent, args }) => {
  const rejectButton = canvas.getByRole("button", { name: "Odrzuć opcjonalne" });
  await userEvent.click(rejectButton);
  await expect(args.onRejectOptional).toHaveBeenCalled();
});

export const AllEnabled = meta.story({
  args: {
    defaultPreferences: { analytics: true, marketing: true }
  }
});

AllEnabled.test("Analytics and marketing are checked", async ({ canvas }) => {
  const analyticsSwitch = canvas.getByRole("switch", { name: "Analityczne" });
  const marketingSwitch = canvas.getByRole("switch", { name: "Marketingowe" });
  await expect(analyticsSwitch).toHaveAttribute("aria-checked", "true");
  await expect(marketingSwitch).toHaveAttribute("aria-checked", "true");
});

export const AllOptionalDisabled = meta.story({
  args: {
    defaultPreferences: { analytics: false, marketing: false }
  }
});

AllOptionalDisabled.test("Analytics and marketing are unchecked", async ({ canvas }) => {
  const analyticsSwitch = canvas.getByRole("switch", { name: "Analityczne" });
  const marketingSwitch = canvas.getByRole("switch", { name: "Marketingowe" });
  await expect(analyticsSwitch).toHaveAttribute("aria-checked", "false");
  await expect(marketingSwitch).toHaveAttribute("aria-checked", "false");
});

AllOptionalDisabled.test("Toggle analytics and marketing switches", async ({ canvas, userEvent }) => {
  const analyticsSwitch = canvas.getByRole("switch", { name: "Analityczne" });
  const marketingSwitch = canvas.getByRole("switch", { name: "Marketingowe" });

  await userEvent.click(analyticsSwitch);
  await waitFor(async () => {
    await expect(analyticsSwitch).toHaveAttribute("aria-checked", "true");
  });

  await userEvent.click(marketingSwitch);
  await waitFor(async () => {
    await expect(marketingSwitch).toHaveAttribute("aria-checked", "true");
  });

  await userEvent.click(analyticsSwitch);
  await waitFor(async () => {
    await expect(analyticsSwitch).toHaveAttribute("aria-checked", "false");
  });
});

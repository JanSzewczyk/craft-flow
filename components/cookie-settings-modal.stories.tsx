import { expect, fn, screen, waitFor } from "storybook/test";

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
DefaultPreferences.test("Renders all expected content", async () => {
  await waitFor(async () => {
    await expect(screen.getByRole("dialog")).toBeVisible();
  });
  await expect(screen.getByText("Niezbędne")).toBeVisible();
  await expect(screen.getByText("Analityczne")).toBeVisible();
  await expect(screen.getByText("Marketingowe")).toBeVisible();

  const switches = screen.getAllByRole("switch");
  await expect(switches).toHaveLength(3);

  const essentialSwitch = screen.getByRole("switch", { name: "Niezbędne" });
  await expect(essentialSwitch).toHaveAttribute("aria-checked", "true");
  await expect(essentialSwitch).toBeDisabled();
});

// Interaction: Save
DefaultPreferences.test("Save button calls onSave with current preferences", async ({ userEvent, args }) => {
  const saveButton = screen.getByRole("button", { name: "Zapisz preferencje" });
  await userEvent.click(saveButton);
  await waitFor(async () => {
    await expect(args.onSave).toHaveBeenCalledWith({ analytics: true, marketing: false });
  });
});

// Interaction: Reject
DefaultPreferences.test("Reject button calls onRejectOptional", async ({ userEvent, args }) => {
  const rejectButton = screen.getByRole("button", { name: "Odrzuć opcjonalne" });
  await userEvent.click(rejectButton);
  await waitFor(async () => {
    await expect(args.onRejectOptional).toHaveBeenCalled();
  });
});

export const AllEnabled = meta.story({
  args: {
    defaultPreferences: { analytics: true, marketing: true }
  }
});

AllEnabled.test("Analytics and marketing are checked", async () => {
  const analyticsSwitch = screen.getByRole("switch", { name: "Analityczne" });
  const marketingSwitch = screen.getByRole("switch", { name: "Marketingowe" });
  await expect(analyticsSwitch).toHaveAttribute("aria-checked", "true");
  await expect(marketingSwitch).toHaveAttribute("aria-checked", "true");
});

export const AllOptionalDisabled = meta.story({
  args: {
    defaultPreferences: { analytics: false, marketing: false }
  }
});

AllOptionalDisabled.test("Analytics and marketing are unchecked", async () => {
  const analyticsSwitch = screen.getByRole("switch", { name: "Analityczne" });
  const marketingSwitch = screen.getByRole("switch", { name: "Marketingowe" });
  await expect(analyticsSwitch).toHaveAttribute("aria-checked", "false");
  await expect(marketingSwitch).toHaveAttribute("aria-checked", "false");
});

AllOptionalDisabled.test("Toggle analytics and marketing switches", async ({ step, userEvent }) => {
  const analyticsSwitch = screen.getByRole("switch", { name: "Analityczne" });
  const marketingSwitch = screen.getByRole("switch", { name: "Marketingowe" });

  await step("Enable analytics switch", async () => {
    await userEvent.click(analyticsSwitch);
    await waitFor(async () => {
      await expect(analyticsSwitch).toHaveAttribute("aria-checked", "true");
    });
  });

  await step("Enable marketing switch", async () => {
    await userEvent.click(marketingSwitch);
    await waitFor(async () => {
      await expect(marketingSwitch).toHaveAttribute("aria-checked", "true");
    });
  });

  await step("Disable analytics switch", async () => {
    await userEvent.click(analyticsSwitch);
    await waitFor(async () => {
      await expect(analyticsSwitch).toHaveAttribute("aria-checked", "false");
    });
  });
});

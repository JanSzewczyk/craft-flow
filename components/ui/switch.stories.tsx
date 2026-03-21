import { useState } from "react";

import { expect, waitFor } from "storybook/test";

import { Switch } from "./switch";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Components/UI/Switch",
  component: Switch,
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-8">
        <Story />
      </div>
    )
  ],
  parameters: {
    layout: "centered"
  }
});

export const Unchecked = meta.story({
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Switch checked={checked} onCheckedChange={setChecked} aria-label="Toggle setting" />;
  }
});

Unchecked.test("Renders with correct ARIA attributes", async ({ canvas }) => {
  const switchEl = canvas.getByRole("switch");
  await expect(switchEl).toBeVisible();
  await expect(switchEl).toHaveAttribute("aria-checked", "false");
  await expect(switchEl).toHaveAttribute("aria-label", "Toggle setting");
});

Unchecked.test("Click toggles state", async ({ canvas, userEvent }) => {
  const switchEl = canvas.getByRole("switch");

  await userEvent.click(switchEl);
  await waitFor(async () => {
    await expect(switchEl).toHaveAttribute("aria-checked", "true");
  });

  await userEvent.click(switchEl);
  await waitFor(async () => {
    await expect(switchEl).toHaveAttribute("aria-checked", "false");
  });
});

Unchecked.test("Space key toggles state", async ({ canvas, userEvent }) => {
  const switchEl = canvas.getByRole("switch");
  switchEl.focus();

  await userEvent.keyboard(" ");
  await waitFor(async () => {
    await expect(switchEl).toHaveAttribute("aria-checked", "true");
  });

  await userEvent.keyboard(" ");
  await waitFor(async () => {
    await expect(switchEl).toHaveAttribute("aria-checked", "false");
  });
});

Unchecked.test("Enter key toggles state", async ({ canvas, userEvent }) => {
  const switchEl = canvas.getByRole("switch");
  switchEl.focus();

  await userEvent.keyboard("{Enter}");
  await waitFor(async () => {
    await expect(switchEl).toHaveAttribute("aria-checked", "true");
  });

  await userEvent.keyboard("{Enter}");
  await waitFor(async () => {
    await expect(switchEl).toHaveAttribute("aria-checked", "false");
  });
});

export const Checked = meta.story({
  render: () => {
    const [checked, setChecked] = useState(true);
    return <Switch checked={checked} onCheckedChange={setChecked} aria-label="Checked switch" />;
  }
});

export const Disabled = meta.story({
  render: () => {
    return <Switch checked={true} onCheckedChange={() => {}} disabled aria-label="Disabled switch" />;
  }
});

Disabled.test("Disabled prevents toggle", async ({ canvas, userEvent }) => {
  const switchEl = canvas.getByRole("switch");
  await expect(switchEl).toBeDisabled();
  await expect(switchEl).toHaveAttribute("aria-checked", "true");

  await userEvent.click(switchEl);
  await waitFor(async () => {
    await expect(switchEl).toHaveAttribute("aria-checked", "true");
  });
});

import { FolderOpenIcon, HardHatIcon } from "lucide-react";

import { expect } from "storybook/test";

import { KpiCard } from "./kpi-card";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Contractor/Kpi Card",
  component: KpiCard,
  parameters: {
    layout: "centered"
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    )
  ]
});

export const DefaultCard = meta.story({
  args: {
    title: "Aktywne projekty",
    value: 7,
    icon: FolderOpenIcon,
    variant: "default"
  }
});

DefaultCard.test("Renders correctly", async ({ canvas, step }) => {
  await step("Shows title and value", async () => {
    await expect(canvas.getByText("Aktywne projekty")).toBeVisible();
    await expect(canvas.getByText("7")).toBeVisible();
  });

  await step("Icon wrapper has primary color classes", async () => {
    const iconWrapper = canvas.getByText("Aktywne projekty").closest("div")?.parentElement?.querySelector("div");
    await expect(iconWrapper).toHaveClass("bg-primary/10");
    await expect(iconWrapper).toHaveClass("text-primary");
  });

  await step("Value is rendered in monospace font", async () => {
    await expect(canvas.getByText("7")).toHaveClass("font-mono");
  });
});

export const WarningCard = meta.story({
  args: {
    title: "Limit projektów",
    value: "4/5",
    icon: HardHatIcon,
    variant: "warning"
  }
});

WarningCard.test("Renders correctly with warning styling", async ({ canvas, step }) => {
  await step("Shows title and value", async () => {
    await expect(canvas.getByText("Limit projektów")).toBeVisible();
    await expect(canvas.getByText("4/5")).toBeVisible();
  });

  await step("Icon wrapper has error color classes", async () => {
    const iconWrapper = canvas.getByText("Limit projektów").closest("div")?.parentElement?.querySelector("div");
    await expect(iconWrapper).toHaveClass("bg-error/10");
    await expect(iconWrapper).toHaveClass("text-error");
  });
});

export const InfinityValue = meta.story({
  args: {
    title: "Limit projektów",
    value: "∞",
    icon: HardHatIcon,
    variant: "default"
  }
});

InfinityValue.test("Renders infinity symbol as value", async ({ canvas }) => {
  await expect(canvas.getByText("∞")).toBeVisible();
});

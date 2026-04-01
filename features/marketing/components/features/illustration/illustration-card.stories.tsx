import { expect } from "storybook/test";

import { Settings2 } from "lucide-react";

import preview from "~/.storybook/preview";

import { IllustrationCard } from "./illustration-card";

const meta = preview.meta({
  title: "Marketing/Features/Illustration Card",
  component: IllustrationCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  },
  args: {
    gradientClass: "from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900",
    icon: <Settings2 className="size-24 text-blue-200 dark:text-blue-800" aria-hidden="true" />,
    cardTitle: "Przykładowy tytuł karty",
    children: <p className="text-body-sm text-muted-foreground">Treść karty ilustracyjnej</p>
  }
});

export const Default = meta.story({});

Default.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Renders card title", async () => {
    await expect(canvas.getByText("Przykładowy tytuł karty")).toBeVisible();
  });

  await step("Renders children content", async () => {
    await expect(canvas.getByText("Treść karty ilustracyjnej")).toBeVisible();
  });
});

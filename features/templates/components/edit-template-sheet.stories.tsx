import { expect, fn } from "storybook/test";

import preview from "~/.storybook/preview";

import { EditTemplateSheet } from "./edit-template-sheet";

const defaultValues = {
  name: "Produkcja Stołu Loft",
  description: "Szablon do produkcji stołów loftowych",
  steps: [
    { title: "Projekt", description: null },
    { title: "Zamówienie materiałów", description: null },
    { title: "Produkcja", description: null }
  ]
};

const meta = preview.meta({
  title: "Features/Templates/Edit Template Sheet",
  component: EditTemplateSheet,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true }
  },
  args: {
    templateId: "tpl-1",
    defaultValues,
    onUpdateAction: fn(async () => ({ success: true as const, data: {} as never, message: "Szablon został zapisany" }))
  }
});

export const Default = meta.story({});

Default.test("Renders sheet with pre-filled form and action buttons", async ({ canvas, step }) => {
  await step("Sheet title and template name subtitle are visible", async () => {
    await expect(canvas.getByText("Edytuj szablon")).toBeVisible();
    await expect(canvas.getByText("Produkcja Stołu Loft")).toBeVisible();
  });

  await step("Form is pre-filled with existing data", async () => {
    const nameInput = canvas.getByRole("textbox", { name: /nazwa/i });
    await expect(nameInput).toHaveValue("Produkcja Stołu Loft");
  });

  await step("Action buttons are visible", async () => {
    await expect(canvas.getByRole("button", { name: "Anuluj" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Zapisz zmiany" })).toBeVisible();
  });
});

export const NoDescription = meta.story({
  args: {
    defaultValues: {
      ...defaultValues,
      description: null
    }
  }
});

NoDescription.test("Renders sheet without description", async ({ canvas }) => {
  await expect(canvas.getByText("Edytuj szablon")).toBeVisible();
  await expect(canvas.getByRole("button", { name: "Zapisz zmiany" })).toBeVisible();
});

import { expect, fn, waitFor, screen, within } from "storybook/test";

import preview from "~/.storybook/preview";
import { templateFormBuilder } from "~/features/templates/test/builders/template-form.builder";

import { EditTemplateSheet } from "./edit-template-sheet";

const meta = preview.meta({
  title: "Features/Templates/Forms/Edit Template Sheet",
  component: EditTemplateSheet,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true }
  },
  args: {
    templateId: "tpl-1",
    defaultValues: templateFormBuilder.one(),
    onUpdateAction: fn(async () => ({ success: true as const, data: {} as never, message: "Szablon został zapisany" }))
  }
});

export const Default = meta.story({});

Default.test("Renders sheet with pre-filled form and action buttons", async ({ step, args }) => {
  const canvas = within(await screen.findByRole("dialog", { name: /edytuj szablon/i }));
  await expect(canvas).not.toBeNull();

  await step("Sheet title and template name subtitle are visible", async () => {
    await expect(canvas.getByText("Edytuj szablon")).toBeVisible();
    await expect(canvas.getByText(args.defaultValues.name)).toBeVisible();
  });

  await step("Form is pre-filled with existing data", async () => {
    const nameInput = canvas.getByRole("textbox", { name: /nazwa/i });
    await expect(nameInput).toHaveValue(args.defaultValues.name);
  });

  await step("Action buttons are visible", async () => {
    await expect(canvas.getByRole("button", { name: "Anuluj" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Zapisz zmiany" })).toBeVisible();
  });
});

export const NoDescription = meta.story({
  args: {
    defaultValues: templateFormBuilder.one({ overrides: { description: null } })
  }
});

NoDescription.test("Renders sheet without description", async ({ args }) => {
  const canvas = within(await screen.findByRole("dialog", { name: /edytuj szablon/i }));
  await expect(canvas).not.toBeNull();

  await expect(canvas.getByText("Edytuj szablon")).toBeVisible();
  await expect(canvas.getByText(args.defaultValues.name)).toBeVisible();
  await expect(canvas.getByRole("button", { name: "Zapisz zmiany" })).toBeVisible();
});

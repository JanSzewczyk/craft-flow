import { expect, fn } from "storybook/test";

import { CreateTemplateSheet } from "./create-template-sheet";
import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Templates/Forms/Create Template Sheet",
  component: CreateTemplateSheet,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true }
  },
  args: {
    onCreateAction: fn(async () => ({ success: true as const, data: {} as never, message: "Szablon został utworzony" }))
  }
});

export const Default = meta.story({});

Default.test("Renders sheet with form fields and action buttons", async ({ canvas, step }) => {
  await step("Sheet title and description are visible", async () => {
    await expect(canvas.getByText("Utwórz nowy szablon")).toBeVisible();
    await expect(canvas.getByText(/zdefiniuj powtarzalne etapy/i)).toBeVisible();
  });

  await step("Form fields are rendered", async () => {
    await expect(canvas.getByRole("textbox", { name: /nazwa/i })).toBeVisible();
  });

  await step("Action buttons are visible", async () => {
    await expect(canvas.getByRole("button", { name: "Anuluj" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Stwórz szablon" })).toBeVisible();
  });
});

Default.test("Shows validation errors when submitting empty name", async ({ canvas, userEvent }) => {
  const nameInput = canvas.getByRole("textbox", { name: /nazwa/i });
  await userEvent.clear(nameInput);

  await userEvent.click(canvas.getByRole("button", { name: "Stwórz szablon" }));

  await expect(canvas.getByText(/nazwa szablonu nie może być pusta/i)).toBeVisible();
});

import { expect, fn, waitFor, screen, within } from "storybook/test";
import { type Template } from "~/features/templates/server/db";
import { templateBuilder } from "~/features/templates/test/builders";
import { templateFormBuilder } from "~/features/templates/test/builders/template-form.builder";
import { type ActionResponse } from "~/lib/action-types";

import { EditTemplateSheet } from "./edit-template-sheet";

import preview from "~/.storybook/preview";

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
    onUpdateAction: fn(
      async () =>
        ({
          success: true as const,
          data: templateBuilder.one(),
          message: "Szablon został zapisany"
        }) as unknown as ActionResponse<Template>
    )
  }
});

export const Default = meta.story({});

Default.test("Renders sheet with pre-filled form and action buttons", async ({ step, args }) => {
  const canvas = within(await screen.findByRole("dialog", { name: /edytuj szablon/i }));

  await step("Sheet title and template name subtitle are visible", async () => {
    await waitFor(async () => {
      await expect(canvas.getByText("Edytuj szablon")).toBeVisible();
    });
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

  await waitFor(async () => {
    await expect(canvas.getByText("Edytuj szablon")).toBeVisible();
  });
  await expect(canvas.getByText(args.defaultValues.name)).toBeVisible();
  await expect(canvas.getByRole("button", { name: "Zapisz zmiany" })).toBeVisible();
});

export const SubmitSuccess = meta.story({
  args: {
    onUpdateAction: fn(async () => ({ success: true as const, data: {} as never, message: "Szablon został zapisany" }))
  }
});

SubmitSuccess.test("Calls onUpdateAction and shows success toast on valid submit", async ({ args, userEvent }) => {
  const canvas = within(await screen.findByRole("dialog", { name: /edytuj szablon/i }));

  await waitFor(async () => {
    await expect(canvas.getByRole("button", { name: "Zapisz zmiany" })).toBeVisible();
  });
  await userEvent.click(canvas.getByRole("button", { name: "Zapisz zmiany" }));

  await waitFor(async () => {
    await expect(args.onUpdateAction).toHaveBeenCalledOnce();
  });

  await waitFor(async () => {
    await expect(await screen.findByText(/szablon został zapisany/i)).toBeVisible();
  });
});

export const SubmitError = meta.story({
  args: {
    onUpdateAction: fn(async () => ({ success: false as const, error: "Nie udało się zapisać szablonu" }))
  }
});

SubmitError.test("Shows error toast when onUpdateAction returns failure", async ({ args, userEvent }) => {
  const canvas = within(await screen.findByRole("dialog", { name: /edytuj szablon/i }));

  await waitFor(async () => {
    await expect(canvas.getByRole("button", { name: "Zapisz zmiany" })).toBeVisible();
  });
  await userEvent.click(canvas.getByRole("button", { name: "Zapisz zmiany" }));

  await waitFor(async () => {
    await expect(args.onUpdateAction).toHaveBeenCalledOnce();
  });

  await waitFor(async () => {
    await expect(await screen.findByText(/nie udało się zapisać szablonu/i)).toBeVisible();
  });
});

import { expect, fn, screen, waitFor, within } from "storybook/test";
import { type Template } from "~/features/templates/server/db";
import { type ActionResponse } from "~/lib/action-types";

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
    onCreateAction: fn(
      async () =>
        ({
          success: true,
          data: {},
          message: "Szablon został utworzony"
        }) as unknown as ActionResponse<Template>
    )
  }
});

export const Default = meta.story({});

Default.test("Renders sheet with form fields and action buttons", async ({ step }) => {
  const canvas = within(await screen.findByRole("dialog", { name: /utwórz nowy szablon/i }));

  await step("Sheet title and description are visible", async () => {
    await waitFor(async () => {
      await expect(canvas.getByText("Utwórz nowy szablon")).toBeVisible();
    });
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

Default.test("Shows validation errors when submitting empty name", async ({ userEvent }) => {
  const canvas = within(await screen.findByRole("dialog", { name: /utwórz nowy szablon/i }));

  await waitFor(async () => {
    await expect(canvas.getByRole("button", { name: "Stwórz szablon" })).toBeVisible();
  });

  const nameInput = canvas.getByRole("textbox", { name: /nazwa/i });
  await userEvent.clear(nameInput);
  await userEvent.click(canvas.getByRole("button", { name: "Stwórz szablon" }));

  await waitFor(async () => {
    await expect(canvas.getByText(/nazwa szablonu nie może być pusta/i)).toBeVisible();
  });
});

export const SubmitSuccess = meta.story({
  args: {
    onCreateAction: fn(async () => ({ success: true as const, data: {} as never, message: "Szablon został utworzony" }))
  }
});

SubmitSuccess.test("Calls onCreateAction and shows success toast on valid submit", async ({ args, userEvent }) => {
  const canvas = within(await screen.findByRole("dialog", { name: /utwórz nowy szablon/i }));

  await waitFor(async () => {
    await expect(canvas.getByRole("button", { name: "Stwórz szablon" })).toBeVisible();
  });

  // Fill in template name
  const nameInput = canvas.getByRole("textbox", { name: /nazwa/i });
  await userEvent.type(nameInput, "Mój szablon");

  // Edit the default empty step to give it a title (step title is required by validation)
  await userEvent.click(canvas.getByRole("button", { name: "Edytuj etap" }));

  const body = within(document.body);
  await waitFor(async () => {
    await expect(body.getByLabelText("Nazwa etapu")).toBeVisible();
  });
  await userEvent.type(body.getByLabelText("Nazwa etapu"), "Przykładowy etap");
  await userEvent.click(body.getByRole("button", { name: /zapisz/i }));

  // Submit the sheet form
  await userEvent.click(canvas.getByRole("button", { name: "Stwórz szablon" }));

  await waitFor(async () => {
    await expect(args.onCreateAction).toHaveBeenCalledOnce();
  });

  await waitFor(async () => {
    await expect(await screen.findByText(/szablon został utworzony/i)).toBeVisible();
  });
});

export const SubmitError = meta.story({
  args: {
    onCreateAction: fn(async () => ({ success: false, error: "Nie udało się utworzyć szablonu" }))
  }
});

SubmitError.test("Shows error toast when onCreateAction returns failure", async ({ args, userEvent }) => {
  const canvas = within(await screen.findByRole("dialog", { name: /utwórz nowy szablon/i }));

  await waitFor(async () => {
    await expect(canvas.getByRole("button", { name: "Stwórz szablon" })).toBeVisible();
  });

  // Fill in template name
  const nameInput = canvas.getByRole("textbox", { name: /nazwa/i });
  await userEvent.type(nameInput, "Mój szablon");

  // Edit the default empty step to give it a title (step title is required by validation)
  await userEvent.click(canvas.getByRole("button", { name: "Edytuj etap" }));

  const body = within(document.body);
  await waitFor(async () => {
    await expect(body.getByLabelText("Nazwa etapu")).toBeVisible();
  });
  await userEvent.type(body.getByLabelText("Nazwa etapu"), "Przykładowy etap");
  await userEvent.click(body.getByRole("button", { name: /zapisz/i }));

  // Submit the sheet form
  await userEvent.click(canvas.getByRole("button", { name: "Stwórz szablon" }));

  await waitFor(async () => {
    await expect(args.onCreateAction).toHaveBeenCalledOnce();
  });

  await waitFor(async () => {
    await expect(await screen.findByText(/nie udało się utworzyć szablonu/i)).toBeVisible();
  });
});

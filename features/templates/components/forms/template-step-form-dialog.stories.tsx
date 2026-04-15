import { expect, fn, waitFor, within } from "storybook/test";

import { TemplateStepFormDialog } from "./template-step-form-dialog";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Templates/Forms/Template Step Form Dialog",
  component: TemplateStepFormDialog,
  parameters: {
    layout: "padded"
  },
  args: {
    onOpenChange: fn(),
    onSubmit: fn()
  }
});

export const CreateMode = meta.story({
  args: {
    mode: "create"
  }
});

CreateMode.test("Renders dialog with correct title and submit button for create mode", async () => {
  const body = within(document.body);
  // waitFor is needed — Radix Dialog animates on open, elements become visible after animation
  await waitFor(async () => {
    await expect(body.getByText("Dodaj nowy etap")).toBeVisible();
    await expect(body.getByRole("button", { name: /dodaj/i })).toBeVisible();
    await expect(body.getByRole("button", { name: /anuluj/i })).toBeVisible();
  });
});

CreateMode.test("Renders empty title input in create mode", async () => {
  const body = within(document.body);
  const titleInput = body.getByLabelText("Nazwa etapu");
  await expect(titleInput).toHaveValue("");
});

export const EditMode = meta.story({
  args: {
    mode: "edit",
    defaultValues: {
      title: "Realizacja",
      description: "Główna faza wykonania"
    }
  }
});

EditMode.test("Renders dialog with correct title for edit mode", async () => {
  const body = within(document.body);
  await waitFor(async () => {
    await expect(body.getByText("Edytuj etap")).toBeVisible();
  });
});

EditMode.test("Renders pre-filled title input in edit mode", async () => {
  const body = within(document.body);
  const titleInput = body.getByLabelText("Nazwa etapu");
  await expect(titleInput).toHaveValue("Realizacja");
});

EditMode.test("Renders pre-filled description in edit mode", async () => {
  const body = within(document.body);
  const descriptionTextarea = body.getByLabelText("Krótki opis");
  await expect(descriptionTextarea).toHaveValue("Główna faza wykonania");
});

EditMode.test("Renders Zapisz button in edit mode", async () => {
  const body = within(document.body);
  await waitFor(async () => {
    await expect(body.getByRole("button", { name: /zapisz/i })).toBeVisible();
  });
});

export const SubmitCreate = meta.story({
  args: {
    mode: "create",
    onSubmit: fn()
  }
});

SubmitCreate.test("Calls onSubmit with entered data when Dodaj is clicked", async ({ args, userEvent }) => {
  const body = within(document.body);
  const titleInput = body.getByLabelText("Nazwa etapu");
  await userEvent.type(titleInput, "Nowy etap");

  const submitButton = body.getByRole("button", { name: /dodaj/i });
  await userEvent.click(submitButton);

  await waitFor(async () => {
    await expect(args.onSubmit).toHaveBeenCalledOnce();
  });

  await expect(args.onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({
      title: "Nowy etap"
    })
  );
});

SubmitCreate.test("Shows validation error when submitting empty title", async ({ args, userEvent }) => {
  const body = within(document.body);
  const submitButton = body.getByRole("button", { name: /dodaj/i });
  await userEvent.click(submitButton);

  await waitFor(async () => {
    await expect(body.getByText(/nazwa etapu nie może być pusta/i)).toBeVisible();
  });

  await expect(args.onSubmit).not.toHaveBeenCalled();
});

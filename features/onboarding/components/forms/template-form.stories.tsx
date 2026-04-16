import { expect, fn, waitFor, within } from "storybook/test";

import { TemplateForm } from "./template-form";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Onboarding/Forms/Template Form",
  component: TemplateForm,
  parameters: {
    layout: "padded"
  },
  args: {
    onContinueAction: fn(async () => ({ success: true as const, data: null })) as never,
    onBackAction: fn()
  }
});

export const DefaultSteps = meta.story({});

DefaultSteps.test("Renders all expected content", async ({ canvas }) => {
  await expect(canvas.getByLabelText("Nazwa szablonu")).toBeVisible();
  await expect(canvas.getByText("Etapy procesu")).toBeVisible();
  await expect(canvas.getByRole("button", { name: /dodaj kolejny etap/i })).toBeVisible();
  await expect(canvas.getByRole("button", { name: /dalej/i })).toBeVisible();
  await expect(canvas.getByRole("button", { name: /wróć/i })).toBeVisible();
});

DefaultSteps.test("Template name input contains default value", async ({ canvas }) => {
  const nameInput = canvas.getByLabelText("Nazwa szablonu");
  await expect(nameInput).toHaveValue("Mój szablon");
});

DefaultSteps.test("All default template steps are visible", async ({ canvas }) => {
  await expect(canvas.getByText("Wycena")).toBeVisible();
  await expect(canvas.getByText("Pomiary")).toBeVisible();
  await expect(canvas.getByText("Zamówienie materiałów")).toBeVisible();
  await expect(canvas.getByText("Realizacja")).toBeVisible();
  await expect(canvas.getByText("Odbiór")).toBeVisible();
});

DefaultSteps.test("Clicking back button triggers onBackAction", async ({ canvas, userEvent, args }) => {
  const backButton = canvas.getByRole("button", { name: /wróć/i });
  await userEvent.click(backButton);
  await waitFor(async () => {
    await expect(args.onBackAction).toHaveBeenCalledOnce();
  });
});

export const AddStep = meta.story({});

AddStep.test("Clicking Dodaj etap opens the add step dialog", async ({ canvas, userEvent }) => {
  const addButton = canvas.getByRole("button", { name: /dodaj kolejny etap/i });
  await userEvent.click(addButton);

  await waitFor(async () => {
    await expect(within(document.body).getByText("Dodaj nowy etap")).toBeVisible();
  });
});

export const SubmitValid = meta.story({});

SubmitValid.test("Submitting valid default form calls onContinueAction", async ({ canvas, userEvent, args }) => {
  const submitButton = canvas.getByRole("button", { name: /dalej/i });
  await userEvent.click(submitButton);

  await waitFor(async () => {
    await expect(args.onContinueAction).toHaveBeenCalledOnce();
  });
});

SubmitValid.test("onContinueAction is called with the default form data", async ({ canvas, userEvent, args }) => {
  const submitButton = canvas.getByRole("button", { name: /dalej/i });
  await userEvent.click(submitButton);

  await waitFor(async () => {
    await expect(args.onContinueAction).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Mój szablon",
        steps: expect.arrayContaining([
          expect.objectContaining({ title: "Wycena" }),
          expect.objectContaining({ title: "Odbiór" })
        ])
      })
    );
  });
});

export const CustomValues = meta.story({
  args: {
    defaultValues: {
      name: "Remont łazienki",
      description: "Kompleksowy remont",
      steps: [
        { title: "Projekt", description: null },
        { title: "Wykonanie", description: null }
      ]
    }
  }
});

CustomValues.test("Renders pre-filled template name", async ({ canvas }) => {
  const nameInput = canvas.getByLabelText("Nazwa szablonu");
  await expect(nameInput).toHaveValue("Remont łazienki");
});

CustomValues.test("Renders custom steps", async ({ canvas }) => {
  await expect(canvas.getByText("Projekt")).toBeVisible();
  await expect(canvas.getByText("Wykonanie")).toBeVisible();
});

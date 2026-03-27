import * as React from "react";

import { Sortable, SortableItem } from "@szum-tech/design-system";
import { expect, fn, waitFor, within } from "storybook/test";


import { TemplateStepItemForm } from "./template-step-item";

import preview from "~/.storybook/preview";


const MOCK_STEP_ID = "story-step-id";

/**
 * Decorator that wraps TemplateStepItemForm in the required Sortable + SortableItem context.
 * SortableItemHandle requires a Sortable ancestor to function correctly.
 */
function SortableDecorator(Story: React.ComponentType) {
  return (
    <Sortable value={[{ id: MOCK_STEP_ID }]} onValueChange={() => {}} getItemValue={(s) => s.id} strategy="vertical">
      <SortableItem value={MOCK_STEP_ID} asChild>
        <div>
          <Story />
        </div>
      </SortableItem>
    </Sortable>
  );
}

const meta = preview.meta({
  title: "Features/Onboarding/Forms/Template Step Item",
  component: TemplateStepItemForm,
  parameters: {
    layout: "padded"
  },
  decorators: [SortableDecorator]
});

export const Default = meta.story({
  args: {
    templateStep: { title: "Wycena", description: "Analiza kosztów" },
    canRemove: true,
    onUpdate: fn(),
    onRemove: fn()
  }
});

Default.test("Renders step title and description", async ({ canvas }) => {
  await expect(canvas.getByText("Wycena")).toBeVisible();
  await expect(canvas.getByText("Analiza kosztów")).toBeVisible();
});

Default.test("Renders both Edit and Remove buttons when canRemove is true", async ({ canvas }) => {
  // SortableItemHandle adds a drag handle button, so there are 3 buttons total: handle + edit + remove
  const buttons = canvas.getAllByRole("button");
  await expect(buttons).toHaveLength(3);
});

Default.test("Calls onRemove when remove button is clicked", async ({ canvas, args, userEvent }) => {
  const buttons = canvas.getAllByRole("button");
  // Buttons: 0=drag handle, 1=edit, 2=remove
  const removeButton = buttons[2];
  await expect(removeButton).toBeDefined();
  await userEvent.click(removeButton!);
  await waitFor(async () => {
    await expect(args.onRemove).toHaveBeenCalledOnce();
  });
});

export const CannotRemove = meta.story({
  args: {
    templateStep: { title: "Odbiór", description: null },
    canRemove: false,
    onUpdate: fn(),
    onRemove: fn()
  }
});

CannotRemove.test("Renders step title without description when description is null", async ({ canvas }) => {
  await expect(canvas.getByText("Odbiór")).toBeVisible();
  await expect(canvas.queryByText(/opis/i)).toBeNull();
});

CannotRemove.test("Renders only Edit button when canRemove is false", async ({ canvas }) => {
  // SortableItemHandle adds a drag handle button, so there are 2 buttons: handle + edit
  const buttons = canvas.getAllByRole("button");
  await expect(buttons).toHaveLength(2);
});

export const OpenEditDialog = meta.story({
  args: {
    templateStep: { title: "Pomiary", description: null },
    canRemove: true,
    onUpdate: fn(),
    onRemove: fn()
  }
});

OpenEditDialog.test("Opens edit dialog when Edit button is clicked", async ({ canvas, userEvent }) => {
  const buttons = canvas.getAllByRole("button");
  // Buttons: 0=drag handle, 1=edit, 2=remove
  const editButton = buttons[1];
  await expect(editButton).toBeDefined();
  await userEvent.click(editButton!);

  await waitFor(async () => {
    await expect(within(document.body).getByText("Edytuj etap")).toBeVisible();
  });
});

OpenEditDialog.test("Edit dialog shows pre-filled step title", async ({ canvas, userEvent }) => {
  const buttons = canvas.getAllByRole("button");
  // Buttons: 0=drag handle, 1=edit, 2=remove
  const editButton = buttons[1];
  await userEvent.click(editButton!);

  await waitFor(async () => {
    const titleInput = within(document.body).getByLabelText("Nazwa etapu");
    await expect(titleInput).toHaveValue("Pomiary");
  });
});

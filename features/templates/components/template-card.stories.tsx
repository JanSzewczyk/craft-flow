import { expect, fn, screen, waitFor } from "storybook/test";

import preview from "~/.storybook/preview";

import { templateListItemBuilder } from "~/features/templates/test/builders";

import { TemplateCard } from "./template-card";

const baseItem = templateListItemBuilder.one({
  overrides: {
    name: "Produkcja Stołu Loft",
    description: "Szablon do produkcji stołów loftowych",
    stepsCount: 4,
    previewSteps: ["Projekt", "Zamówienie materiałów", "Produkcja"]
  }
});

const meta = preview.meta({
  title: "Features/Templates/Template Card",
  component: TemplateCard,
  parameters: {
    layout: "padded",
    nextjs: { appDirectory: true }
  },
  args: {
    item: baseItem,
    isLastTemplate: false,
    onDeleteAction: fn(async () => ({ success: true as const, data: { id: baseItem.id }, message: "Usunięto" })),
    onDuplicateAction: fn(async () => ({ success: true as const, data: baseItem, message: "Zduplikowano" }))
  }
});

export const WithSteps = meta.story({});

WithSteps.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Template name, badge and description are visible", async () => {
    await expect(canvas.getByText("Produkcja Stołu Loft")).toBeVisible();
    await expect(canvas.getByText("4 etapy")).toBeVisible();
    await expect(canvas.getByText("Szablon do produkcji stołów loftowych")).toBeVisible();
  });

  await step("Preview steps and overflow indicator are visible", async () => {
    await expect(canvas.getByText("Projekt")).toBeVisible();
    await expect(canvas.getByText("Zamówienie materiałów")).toBeVisible();
    await expect(canvas.getByText("Produkcja")).toBeVisible();
    await expect(canvas.getByText("+1 więcej kroków")).toBeVisible();
  });
});

WithSteps.test("Calls onDuplicateAction when Duplikuj is clicked", async ({ canvas, args, userEvent }) => {
  const menuButton = canvas.getByRole("button", { name: /więcej opcji/i });
  await userEvent.click(menuButton);

  await waitFor(async () => {
    await expect(screen.getByText("Duplikuj")).toBeVisible();
  });
  await userEvent.click(screen.getByText("Duplikuj"));

  await waitFor(async () => {
    await expect(args.onDuplicateAction).toHaveBeenCalledWith(args.item.id);
  });
});

WithSteps.test("Opens delete confirmation dialog when Usuń is clicked", async ({ canvas, userEvent }) => {
  const menuButton = canvas.getByRole("button", { name: /więcej opcji/i });
  await userEvent.click(menuButton);

  await waitFor(async () => {
    await expect(screen.getByText("Usuń")).toBeVisible();
  });
  await userEvent.click(screen.getByText("Usuń"));

  await waitFor(async () => {
    await expect(screen.getByText("Usuń szablon")).toBeVisible();
    await expect(screen.getByRole("button", { name: "Usuń" })).toBeVisible();
    await expect(screen.getByRole("button", { name: "Anuluj" })).toBeVisible();
  });
});

WithSteps.test("Calls onDeleteAction after confirming delete", async ({ canvas, args, userEvent }) => {
  const menuButton = canvas.getByRole("button", { name: /więcej opcji/i });
  await userEvent.click(menuButton);

  await waitFor(async () => {
    await expect(screen.getByText("Usuń")).toBeVisible();
  });
  await userEvent.click(screen.getByText("Usuń"));

  await waitFor(async () => {
    await expect(screen.getByRole("button", { name: "Usuń" })).toBeVisible();
  });
  await userEvent.click(screen.getByRole("button", { name: "Usuń" }));

  await waitFor(async () => {
    await expect(args.onDeleteAction).toHaveBeenCalledWith(args.item.id);
  });
});

export const NoDescription = meta.story({
  args: {
    item: templateListItemBuilder.one({ traits: "noDescription", overrides: { name: "Produkcja Stołu Loft" } })
  }
});

NoDescription.test("Renders without description", async ({ canvas }) => {
  await expect(canvas.getByText("Produkcja Stołu Loft")).toBeVisible();
  await expect(canvas.queryByText("Szablon do produkcji stołów loftowych")).toBeNull();
});

export const SingleStep = meta.story({
  args: {
    item: templateListItemBuilder.one({ traits: "singleStep" })
  }
});

SingleStep.test("Renders '1 etap' label for single step", async ({ canvas }) => {
  await expect(canvas.getByText("1 etap")).toBeVisible();
});

export const ManySteps = meta.story({
  args: {
    item: templateListItemBuilder.one({ traits: "manySteps" })
  }
});

ManySteps.test("Renders 'etapów' label for 5+ steps", async ({ canvas }) => {
  await expect(canvas.getByText("6 etapów")).toBeVisible();
});

export const LastTemplateWarning = meta.story({
  args: {
    isLastTemplate: true
  }
});

LastTemplateWarning.test("Shows last template warning in delete dialog", async ({ canvas, userEvent }) => {
  const menuButton = canvas.getByRole("button", { name: /więcej opcji/i });
  await userEvent.click(menuButton);

  await waitFor(async () => {
    await expect(screen.getByText("Usuń")).toBeVisible();
  });
  await userEvent.click(screen.getByText("Usuń"));

  await waitFor(async () => {
    await expect(screen.getByText(/to twój ostatni szablon/i)).toBeVisible();
  });
});

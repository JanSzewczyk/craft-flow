import { expect, fn, screen, waitFor } from "storybook/test";
import { templateListItemBuilder } from "~/features/templates/test/builders";

import { TemplateCard } from "./template-card";

import preview from "~/.storybook/preview";

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

WithSteps.test("Renders all expected content", async ({ canvas, step, args }) => {
  await step("Template name, badge and description are visible", async () => {
    await expect(canvas.getByText(args.item.name)).toBeVisible();
    await expect(canvas.getByText(`${args.item.stepsCount} etapy`)).toBeVisible();
    await expect(canvas.getByText(args.item.description!)).toBeVisible();
  });

  await step("Preview steps and overflow indicator are visible", async () => {
    for (const previewStep of args.item.previewSteps) {
      await expect(canvas.getByText(previewStep)).toBeVisible();
    }
    const overflow = args.item.stepsCount - args.item.previewSteps.length;
    await expect(canvas.getByText(`+${overflow} więcej kroków`)).toBeVisible();
  });
});

WithSteps.test("Opens dropdown and shows all menu items", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: /więcej opcji/i }));

  await waitFor(async () => {
    await expect(screen.getByText("Edytuj")).toBeVisible();
    await expect(screen.getByText("Duplikuj")).toBeVisible();
    await expect(screen.getByText("Usuń")).toBeVisible();
  });
});

WithSteps.test("Closes dropdown when clicking outside", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: /więcej opcji/i }));

  await waitFor(async () => {
    await expect(screen.getByText("Duplikuj")).toBeVisible();
  });
  await userEvent.click(document.body);

  await waitFor(async () => {
    await expect(screen.queryByText("Duplikuj")).toBeNull();
  });
});

WithSteps.test("Edytuj item is a link with correct href", async ({ canvas, args, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: /więcej opcji/i }));

  await waitFor(async () => {
    await expect(screen.getByText("Edytuj")).toBeVisible();
  });
  const link = screen.getByRole("link", { name: /edytuj/i });
  await expect(link).toHaveAttribute("href", `/app/templates/${args.item.id}/edit`);
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

WithSteps.test("Cancel button in delete dialog closes dialog without deleting", async ({ canvas, args, userEvent }) => {
  const menuButton = canvas.getByRole("button", { name: /więcej opcji/i });
  await userEvent.click(menuButton);

  await waitFor(async () => {
    await expect(screen.getByText("Usuń")).toBeVisible();
  });
  await userEvent.click(screen.getByText("Usuń"));

  await waitFor(async () => {
    await expect(screen.getByRole("button", { name: "Anuluj" })).toBeVisible();
  });
  await userEvent.click(screen.getByRole("button", { name: "Anuluj" }));

  await waitFor(async () => {
    await expect(screen.queryByText("Usuń szablon")).toBeNull();
  });
  await expect(args.onDeleteAction).not.toHaveBeenCalled();
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

export const DuplicateError = meta.story({
  args: {
    onDuplicateAction: fn(async () => ({ success: false as const, error: "Limit szablonów osiągnięty" }))
  }
});

DuplicateError.test("Shows error toast when duplicate fails", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: /więcej opcji/i }));

  await waitFor(async () => {
    await expect(screen.getByText("Duplikuj")).toBeVisible();
  });
  await userEvent.click(screen.getByText("Duplikuj"));

  await waitFor(async () => {
    await expect(screen.getByText("Limit szablonów osiągnięty")).toBeVisible();
  });
});

export const DeleteError = meta.story({
  args: {
    onDeleteAction: fn(async () => ({ success: false as const, error: "Nie można usunąć szablonu" }))
  }
});

DeleteError.test("Shows error toast when delete fails", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: /więcej opcji/i }));

  await waitFor(async () => {
    await expect(screen.getByText("Usuń")).toBeVisible();
  });
  await userEvent.click(screen.getByText("Usuń"));

  await waitFor(async () => {
    await expect(screen.getByRole("button", { name: "Usuń" })).toBeVisible();
  });
  await userEvent.click(screen.getByRole("button", { name: "Usuń" }));

  await waitFor(async () => {
    await expect(screen.getByText("Nie można usunąć szablonu")).toBeVisible();
  });
});

export const NoDescription = meta.story({
  args: {
    item: templateListItemBuilder.one({ traits: "noDescription", overrides: { name: "Produkcja Stołu Loft" } })
  }
});

NoDescription.test("Renders without description", async ({ canvas, args }) => {
  await expect(canvas.getByText(args.item.name)).toBeVisible();
  await expect(canvas.queryByText("Szablon do produkcji stołów loftowych")).toBeNull();
});

export const SingleStep = meta.story({
  args: {
    item: templateListItemBuilder.one({ traits: "singleStep" })
  }
});

SingleStep.test("Renders '1 etap' label for single step", async ({ canvas, args }) => {
  await expect(canvas.getByText(`${args.item.stepsCount} etap`)).toBeVisible();
});

export const ManySteps = meta.story({
  args: {
    item: templateListItemBuilder.one({ traits: "manySteps" })
  }
});

ManySteps.test("Renders 'etapów' label for 5+ steps", async ({ canvas, args }) => {
  await expect(canvas.getByText(`${args.item.stepsCount} etapów`)).toBeVisible();
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

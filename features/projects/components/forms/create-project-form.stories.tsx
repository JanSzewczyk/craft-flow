import { expect, fn, waitFor } from "storybook/test";
import { clientBuilder } from "~/features/crm/test/builders";
import { templateBuilder } from "~/features/templates/test/builders/template.builder";
import { type RedirectAction } from "~/lib/action-types";

import { CreateProjectForm } from "./create-project-form";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Projects/Forms/Create Project Form",
  component: CreateProjectForm,
  parameters: {
    layout: "padded",
    nextjs: { appDirectory: true }
  },
  args: {
    clients: clientBuilder.many(3),
    templates: templateBuilder.many(3),
    onCreateAction: fn(async () => ({ success: true }) as never as RedirectAction)
  }
});

export const Default = meta.story({});

Default.test("renders all form sections", async ({ canvas, step }) => {
  await step("Project details section is visible", async () => {
    await expect(canvas.getByText("Szczegóły projektu")).toBeVisible();
    await expect(canvas.getByLabelText(/nazwa projektu/i)).toBeVisible();
    await expect(canvas.getByLabelText(/opis/i)).toBeVisible();
  });

  await step("Template section is visible", async () => {
    await expect(canvas.getByText("Szablon etapów")).toBeVisible();
    await expect(canvas.getByText("Wybierz szablon, który zdefiniuje etapy projektu")).toBeVisible();
  });

  await step("Client section defaults to existing client mode", async () => {
    await expect(canvas.getByText("Przypisz istniejącego klienta do projektu")).toBeVisible();
    await expect(canvas.getByPlaceholderText(/wyszukaj klienta/i)).toBeVisible();
  });

  await step("Action buttons are visible", async () => {
    await expect(canvas.getByRole("button", { name: /anuluj/i })).toBeVisible();
    await expect(canvas.getByRole("button", { name: /utwórz szkic projektu/i })).toBeVisible();
  });
});

Default.test("switches to new client mode", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: /\+ nowy klient/i }));

  await waitFor(async () => {
    await expect(canvas.getByText("Utwórz nowego klienta i przypisz go do projektu")).toBeVisible();
    await expect(canvas.getByLabelText(/imię i nazwisko/i)).toBeVisible();
    await expect(canvas.getByLabelText(/e-mail/i)).toBeVisible();
    await expect(canvas.getByLabelText(/telefon/i)).toBeVisible();
  });
});

Default.test("shows validation errors on empty submit", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: /utwórz szkic projektu/i }));

  await waitFor(async () => {
    await expect(canvas.getByText(/nazwa musi mieć co najmniej 3 znaki/i)).toBeVisible();
  });
});

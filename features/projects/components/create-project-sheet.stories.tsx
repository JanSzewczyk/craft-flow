import { expect, fn } from "storybook/test";

import { clientBuilder, templateBuilder } from "../test/builders";

import { CreateProjectSheet } from "./create-project-sheet";

import preview from "~/.storybook/preview";

const mockTemplates = templateBuilder.many(4);
const mockClients = clientBuilder.many(5);

const meta = preview.meta({
  title: "Features/Projects/Create Project Sheet",
  component: CreateProjectSheet,
  args: {
    isOpen: true,
    onOpenChange: fn(),
    onCreateAction: fn().mockResolvedValue({ success: true, data: { id: "project-123" } }),
    templates: mockTemplates,
    clients: mockClients
  },
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        push: fn()
      }
    }
  }
});

export const EmptyForm = meta.story({
  name: "Empty Form"
});

EmptyForm.test("Renders sheet title and description", async ({ canvas }) => {
  await expect(canvas.getByText("Nowe zlecenie")).toBeVisible();
  await expect(canvas.getByText("Wypełnij poniższe pola, aby utworzyć szkic projektu.")).toBeVisible();
});

EmptyForm.test("Renders project name field", async ({ canvas }) => {
  await expect(canvas.getByLabelText("Nazwa projektu")).toBeVisible();
});

EmptyForm.test("Renders template select", async ({ canvas }) => {
  await expect(canvas.getByText("Szablon etapów")).toBeVisible();
});

EmptyForm.test("Renders client combobox", async ({ canvas }) => {
  await expect(canvas.getByLabelText("Klient")).toBeVisible();
});

EmptyForm.test("Renders Anuluj and submit buttons", async ({ canvas }) => {
  await expect(canvas.getByRole("button", { name: "Anuluj" })).toBeVisible();
  await expect(canvas.getByRole("button", { name: "Utwórz szkic projektu" })).toBeVisible();
});

export const WithClientSearch = meta.story({
  name: "With Client Search"
});

WithClientSearch.test("Shows client dropdown when typing in combobox", async ({ canvas, userEvent }) => {
  const input = canvas.getByLabelText("Klient");
  await userEvent.type(input, mockClients[0]?.name.slice(0, 3) ?? "Jan");
  const listbox = canvas.getByRole("listbox", { name: "Lista klientów" });
  await expect(listbox).toBeVisible();
});

WithClientSearch.test("Shows create option when typing a name", async ({ canvas, userEvent }) => {
  const input = canvas.getByLabelText("Klient");
  await userEvent.type(input, "Anna Nowa");
  await expect(canvas.getByText(/Utwórz klienta:/)).toBeVisible();
});

export const NoTemplatesOrClients = meta.story({
  name: "No Templates or Clients",
  args: {
    templates: [],
    clients: []
  }
});

NoTemplatesOrClients.test("Renders sheet with empty template and client lists", async ({ canvas }) => {
  await expect(canvas.getByText("Nowe zlecenie")).toBeVisible();
  await expect(canvas.getByLabelText("Nazwa projektu")).toBeVisible();
});

export const WithValidationErrors = meta.story({
  name: "With Validation Errors"
});

WithValidationErrors.test("Shows validation errors when submitting empty form", async ({ canvas, userEvent }) => {
  const submitButton = canvas.getByRole("button", { name: "Utwórz szkic projektu" });
  await userEvent.click(submitButton);
  await expect(canvas.getByText("Nazwa musi mieć co najmniej 3 znaki")).toBeVisible();
});

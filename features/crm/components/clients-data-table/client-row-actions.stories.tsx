import { expect, fn, screen, waitFor, within } from "storybook/test";
import { type ActionResponse } from "~/lib/action-types";
import { clientListItemBuilder } from "~/features/crm/test/builders";

import { ClientRowActions } from "./client-row-actions";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/CRM/Client Row Actions",
  component: ClientRowActions,
  parameters: {
    layout: "centered"
  },
  args: {
    client: clientListItemBuilder.one({ overrides: { name: "Jan Kowalski" } }),
    onDeleteAction: fn(
      async () =>
        ({ success: true, data: { id: "1" }, message: "Klient został usunięty" }) as unknown as ActionResponse<{
          id: string;
        }>
    )
  }
});

export const NoProjects = meta.story({});

NoProjects.test("Opens dropdown with menu items", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: /więcej opcji/i }));

  const body = within(document.body);
  await waitFor(async () => {
    await expect(body.getByText("Zobacz szczegóły")).toBeVisible();
    await expect(body.getByText("Usuń")).toBeVisible();
  });
});

NoProjects.test("'Zobacz szczegóły' links to client page", async ({ canvas, userEvent, args }) => {
  await userEvent.click(canvas.getByRole("button", { name: /więcej opcji/i }));

  const body = within(document.body);
  await waitFor(async () => {
    const link = body.getByRole("menuitem", { name: /zobacz szczegóły/i });
    await expect(link).toHaveAttribute("href", `/app/clients/${args.client.id}`);
  });
});

NoProjects.test("'Usuń' opens confirmation dialog for client without projects", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: /więcej opcji/i }));

  const body = within(document.body);
  await waitFor(async () => {
    await expect(body.getByText("Usuń")).toBeVisible();
  });
  await userEvent.click(body.getByText("Usuń"));

  await waitFor(async () => {
    await expect(screen.getByText("Usuń klienta")).toBeVisible();
    await expect(screen.getByText(/jan kowalski/i)).toBeVisible();
  });
});

NoProjects.test("Cancel closes confirmation dialog without calling action", async ({ canvas, userEvent, args }) => {
  await userEvent.click(canvas.getByRole("button", { name: /więcej opcji/i }));

  const body = within(document.body);
  await waitFor(async () => {
    await expect(body.getByText("Usuń")).toBeVisible();
  });
  await userEvent.click(body.getByText("Usuń"));

  await waitFor(async () => {
    await expect(screen.getByRole("button", { name: "Anuluj" })).toBeVisible();
  });
  await userEvent.click(screen.getByRole("button", { name: "Anuluj" }));

  await expect(args.onDeleteAction).not.toHaveBeenCalled();
});

export const WithProjects = meta.story({
  args: {
    client: clientListItemBuilder.one({ traits: "withProjects", overrides: { name: "Anna Nowak" } })
  }
});

WithProjects.test("'Usuń' opens warning dialog for client with projects", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: /więcej opcji/i }));

  const body = within(document.body);
  await waitFor(async () => {
    await expect(body.getByText("Usuń")).toBeVisible();
  });
  await userEvent.click(body.getByText("Usuń"));

  await waitFor(async () => {
    await expect(screen.getByText("Nie można usunąć klienta")).toBeVisible();
    await expect(screen.getByText(/przypisane aktywne lub archiwalne projekty/i)).toBeVisible();
  });
});

WithProjects.test("'Rozumiem' closes warning dialog", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: /więcej opcji/i }));

  const body = within(document.body);
  await waitFor(async () => {
    await expect(body.getByText("Usuń")).toBeVisible();
  });
  await userEvent.click(body.getByText("Usuń"));

  await waitFor(async () => {
    await expect(screen.getByRole("button", { name: "Rozumiem" })).toBeVisible();
  });
  await userEvent.click(screen.getByRole("button", { name: "Rozumiem" }));

  await waitFor(async () => {
    await expect(screen.queryByText("Nie można usunąć klienta")).toBeNull();
  });
});

export const DeleteSuccess = meta.story({
  args: {
    client: clientListItemBuilder.one({ overrides: { name: "Jan Kowalski" } }),
    onDeleteAction: fn(async () => ({ success: true as const, data: { id: "1" }, message: "Klient został usunięty" }))
  }
});

DeleteSuccess.test("Calls onDeleteAction and shows success toast", async ({ canvas, userEvent, args }) => {
  await userEvent.click(canvas.getByRole("button", { name: /więcej opcji/i }));

  const body = within(document.body);
  await waitFor(async () => {
    await expect(body.getByText("Usuń")).toBeVisible();
  });
  await userEvent.click(body.getByText("Usuń"));

  await waitFor(async () => {
    await expect(screen.getByText("Usuń klienta")).toBeVisible();
  });

  const confirmBtn = screen.getAllByRole("button", { name: "Usuń" });
  await userEvent.click(confirmBtn[confirmBtn.length - 1]!);

  await waitFor(async () => {
    await expect(args.onDeleteAction).toHaveBeenCalledOnce();
  });

  await waitFor(async () => {
    await expect(await screen.findByText(/klient został usunięty/i)).toBeVisible();
  });
});

export const DeleteError = meta.story({
  args: {
    client: clientListItemBuilder.one({ overrides: { name: "Jan Kowalski" } }),
    onDeleteAction: fn(async () => ({ success: false as const, error: "Nie udało się usunąć klienta" }))
  }
});

DeleteError.test("Shows error toast when delete fails", async ({ canvas, userEvent, args }) => {
  await userEvent.click(canvas.getByRole("button", { name: /więcej opcji/i }));

  const body = within(document.body);
  await waitFor(async () => {
    await expect(body.getByText("Usuń")).toBeVisible();
  });
  await userEvent.click(body.getByText("Usuń"));

  await waitFor(async () => {
    await expect(screen.getByText("Usuń klienta")).toBeVisible();
  });

  const confirmBtn = screen.getAllByRole("button", { name: "Usuń" });
  await userEvent.click(confirmBtn[confirmBtn.length - 1]!);

  await waitFor(async () => {
    await expect(args.onDeleteAction).toHaveBeenCalledOnce();
  });

  await waitFor(async () => {
    await expect(await screen.findByText(/nie udało się usunąć klienta/i)).toBeVisible();
  });
});

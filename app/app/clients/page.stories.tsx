import { expect, type Mock } from "storybook/test";
import { getClientList } from "~/features/crm/server/services/clients.service";
import { clientListItemBuilder } from "~/features/crm/test/builders";

import ClientsLayout from "./layout";
import ClientsPage from "./page";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Pages/Craftman/Clients",
  component: ClientsPage,
  args: {
    params: Promise.resolve({}),
    searchParams: Promise.resolve({})
  },
  parameters: {
    layout: "padded",
    react: { rsc: true },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/app/clients"
      }
    }
  },
  decorators: [
    (Story) => (
      <ClientsLayout sheet={null}>
        <Story />
      </ClientsLayout>
    )
  ]
});

export const WithClients = meta.story();

WithClients.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Breadcrumbs are visible", async () => {
    await expect(canvas.getByRole("link", { name: "Craft Flow" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Baza Klientów" })).toBeVisible();
  });

  await step("Page heading and description are visible", async () => {
    await expect(canvas.getByRole("heading", { name: "Baza Klientów" })).toBeVisible();
    await expect(canvas.getByText(/zarządzaj swoją bazą kontaktów/i)).toBeVisible();
  });

  await step("Add client button links to new client page", async () => {
    const link = canvas.getByRole("link", { name: /dodaj klienta/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/app/clients/new");
  });

  await step("Search input is present", async () => {
    await expect(canvas.getByPlaceholderText("Szukaj po nazwisku, e-mailu...")).toBeVisible();
  });

  await step("Table renders all client rows", async () => {
    const rows = canvas.getAllByRole("row");
    // 1 header row + 5 data rows
    await expect(rows).toHaveLength(6);
  });

  await step("Pagination is visible", async () => {
    await expect(canvas.getByText("Strona 1 z 3")).toBeVisible();
  });
});

export const EmptyState = meta.story({
  beforeEach: () => {
    (getClientList as unknown as Mock).mockResolvedValue([
      null,
      {
        items: [],
        pagination: {
          totalCount: 0,
          totalPages: 0,
          currentPage: 1,
          perPage: 10,
          hasNextPage: false,
          hasPrevPage: false
        }
      }
    ]);
  }
});

EmptyState.test("Renders empty state instead of table", async ({ canvas, step }) => {
  await step("Page header is visible", async () => {
    await expect(canvas.getByRole("heading", { name: "Baza Klientów" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: /dodaj klienta/i })).toBeVisible();
  });

  await step("Empty state content is visible", async () => {
    await expect(canvas.getByText(/brak klientów/i)).toBeVisible();
    await expect(canvas.getByRole("link", { name: /dodaj pierwszego klienta/i })).toBeVisible();
  });

  await step("Table is not rendered", async () => {
    const table = canvas.queryByRole("table");
    await expect(table).toBeNull();
  });
});

export const SinglePage = meta.story({
  beforeEach: () => {
    (getClientList as unknown as Mock).mockResolvedValue([
      null,
      {
        items: clientListItemBuilder.many(3),
        pagination: {
          totalCount: 3,
          totalPages: 1,
          currentPage: 1,
          perPage: 10,
          hasNextPage: false,
          hasPrevPage: false
        }
      }
    ]);
  }
});

SinglePage.test("Renders table without pagination for single page", async ({ canvas, step }) => {
  await step("Table renders all rows", async () => {
    const rows = canvas.getAllByRole("row");
    // 1 header row + 3 data rows
    await expect(rows).toHaveLength(4);
  });

  await step("Pagination buttons are not rendered", async () => {
    const prevButton = canvas.queryByRole("button", { name: /poprzednia strona/i });
    const nextButton = canvas.queryByRole("button", { name: /następna strona/i });
    await expect(prevButton).toBeNull();
    await expect(nextButton).toBeNull();
  });
});

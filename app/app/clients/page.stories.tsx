import { PlusIcon } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button
} from "@szum-tech/design-system";
import Link from "next/link";
import { expect, fn } from "storybook/test";
import { PaginationNav } from "~/components/ui/pagination-nav";
import { SearchInput } from "~/components/ui/search-input";
import { ClientsDataTable } from "~/features/crm/components/clients-data-table/clients-data-table";
import { ClientsEmptyState } from "~/features/crm/components/clients-empty-state";
import { type ClientListItem } from "~/features/crm/server/db/queries";
import { clientListItemBuilder } from "~/features/crm/test/builders";
import { type ActionResponse } from "~/lib/action-types";
import { type PaginationMeta } from "~/types/pagination";

import preview from "~/.storybook/preview";

const deleteAction = fn(
  async () =>
    ({ success: true, data: { id: "1" }, message: "Klient został usunięty" }) as unknown as ActionResponse<{
      id: string;
    }>
);

function ClientsPageLayout({
  items,
  pagination,
  search = ""
}: {
  items: ClientListItem[];
  pagination: PaginationMeta;
  search?: string;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/app/dashboard">Craft Flow</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Baza Klientów</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-heading-h1">Baza Klientów</h1>
          <p className="text-lead text-muted-foreground">
            Zarządzaj swoją bazą kontaktów, monitoruj statusy i zyskaj szybki dostęp do informacji o swoich klientach.
          </p>
        </div>

        <div className="flex shrink-0 items-start">
          <Button asChild startIcon={<PlusIcon />}>
            <Link href="/app/clients/new">Dodaj klienta</Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SearchInput defaultValue={search} placeholder="Szukaj po nazwisku, e-mailu..." />
      </div>

      {items.length === 0 ? (
        <ClientsEmptyState />
      ) : (
        <div className="space-y-6">
          <ClientsDataTable items={items} onDeleteAction={deleteAction} />
          <PaginationNav pagination={pagination} />
        </div>
      )}
    </div>
  );
}

const meta = preview.meta({
  title: "Pages/Clients",
  component: ClientsPageLayout,
  parameters: {
    layout: "padded",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/app/clients"
      }
    }
  }
});

export const WithClients = meta.story({
  args: {
    items: [
      clientListItemBuilder.one({ traits: "registered", overrides: { name: "Anna Kowalska" } }),
      clientListItemBuilder.one({ traits: "noPhone", overrides: { name: "Jan Nowak" } }),
      clientListItemBuilder.one({ traits: "withProjects", overrides: { name: "Maria Wiśniewska" } }),
      clientListItemBuilder.one({ overrides: { name: "Piotr Zieliński" } }),
      clientListItemBuilder.one({ traits: "registered", overrides: { name: "Katarzyna Wójcik" } })
    ],
    pagination: {
      totalCount: 25,
      totalPages: 3,
      currentPage: 1,
      perPage: 10,
      hasNextPage: true,
      hasPrevPage: false
    }
  }
});

WithClients.test("Renders all expected content", async ({ canvas, step, args }) => {
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
    await expect(rows).toHaveLength(args.items.length + 1);
  });

  await step("Pagination is visible", async () => {
    await expect(canvas.getByText("Strona 1 z 3")).toBeVisible();
  });
});

export const EmptyState = meta.story({
  args: {
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
  args: {
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
});

SinglePage.test("Renders table without pagination for single page", async ({ canvas, step, args }) => {
  await step("Table renders all rows", async () => {
    const rows = canvas.getAllByRole("row");
    await expect(rows).toHaveLength(args.items.length + 1);
  });

  await step("Pagination buttons are not rendered", async () => {
    const prevButton = canvas.queryByRole("button", { name: /poprzednia strona/i });
    const nextButton = canvas.queryByRole("button", { name: /następna strona/i });
    await expect(prevButton).toBeNull();
    await expect(nextButton).toBeNull();
  });
});

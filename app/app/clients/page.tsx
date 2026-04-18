import { PlusIcon } from "lucide-react";
import { type Metadata } from "next";

import { auth } from "@clerk/nextjs/server";
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
import { redirect } from "next/navigation";
import { SearchInput } from "~/components/ui/search-input";
import { ClientsDataTable } from "~/features/crm/components/clients-data-table/clients-data-table";
import { ClientsEmptyState } from "~/features/crm/components/clients-empty-state";
import { ClientsPagination } from "~/features/crm/components/clients-pagination";
import { deleteClientAction } from "~/features/crm/server/actions/delete-client.action";
import { getClientList } from "~/features/crm/server/services/clients.service";
import { createLogger } from "~/lib/logger";

export const metadata: Metadata = {
  title: "Baza Klientów"
};

const logger = createLogger({ module: "clients-page" });

function parseSearchParams(raw: Record<string, string | string[] | undefined>) {
  const search = typeof raw.search === "string" ? raw.search.trim() : "";
  const pageRaw = typeof raw.page === "string" ? Number.parseInt(raw.page, 10) : 1;
  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? pageRaw : 1;
  return { search, page };
}

async function loadData(searchParams: PageProps<"/app/clients">["searchParams"]) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  const params = await searchParams;
  const { search, page } = parseSearchParams(params);

  const [listError, listResult] = await getClientList(userId, { search, page, perPage: 10 });
  if (listError) {
    logger.error({ userId, errorCode: listError.code }, "Failed to load client list");
    throw listError;
  }

  logger.info({ userId }, "Successfully loaded clients page data");
  return { search, listResult };
}

export default async function ClientsPage({ searchParams }: PageProps<"/app/clients">) {
  const { search, listResult } = await loadData(searchParams);

  const { items } = listResult;

  return (
    <div className="space-y-6">
      {/* Page header */}
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

      {/* Search */}
      <div className="flex items-center gap-4">
        <SearchInput defaultValue={search} placeholder="Szukaj po nazwisku, e-mailu..." />
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <ClientsEmptyState />
      ) : (
        <div className="space-y-6">
          <ClientsDataTable items={items} onDeleteAction={deleteClientAction} />
          <ClientsPagination pagination={listResult.pagination} />
        </div>
      )}
    </div>
  );
}

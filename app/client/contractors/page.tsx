import * as React from "react";

import { type Metadata } from "next";

import { auth } from "@clerk/nextjs/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@szum-tech/design-system";
import { redirect } from "next/navigation";
import { PaginationNav } from "~/components/ui/pagination-nav";
import { SearchInput } from "~/components/ui/search-input";
import { ContractorsDataTable, ContractorsEmptyState } from "~/features/crm/components";
import { getClientContractorsList } from "~/features/projects/server/services/projects.service";
import { createLogger } from "~/lib/logger";
import { parseSearchParams } from "~/utils/search-params";

export const metadata: Metadata = { title: "Wykonawcy" };

const logger = createLogger({ module: "client-contractors-page" });

async function loadData(searchParams: PageProps<"/client/contractors">["searchParams"]) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  const params = await searchParams;
  const { search, page } = parseSearchParams(params);

  const [err, listResult] = await getClientContractorsList({ userId, options: { search, page, perPage: 10 } });
  if (err) {
    logger.error({ userId, errorCode: err.code }, "Failed to load contractors");
    throw err;
  }

  logger.info({ userId, contractorCount: listResult.items.length }, "Successfully loaded contractors page data");
  return { search, listResult };
}

export default async function ClientContractorsPage({ searchParams }: PageProps<"/client/contractors">) {
  const { search, listResult } = await loadData(searchParams);
  const { items } = listResult;

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="text-muted-foreground">CraftFlow</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Wykonawcy</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-heading-h1">Wykonawcy</h1>
        <p className="text-lead text-muted-foreground">
          Wykonawcy, z którymi realizujesz lub realizowałeś projekty w systemie CraftFlow.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <SearchInput defaultValue={search} placeholder="Szukaj po nazwie firmy..." />
      </div>

      {items.length === 0 ? (
        <ContractorsEmptyState />
      ) : (
        <div className="space-y-6">
          <ContractorsDataTable items={items} />
          <PaginationNav pagination={listResult.pagination} />
        </div>
      )}
    </div>
  );
}

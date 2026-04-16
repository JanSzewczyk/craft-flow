import { type Metadata } from "next";

import { auth } from "@clerk/nextjs/server";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Progress
} from "@szum-tech/design-system";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SearchInput } from "~/components/ui/search-input";
import { CreateTemplateButton } from "~/features/templates/components/create-template-button";
import { CreateTemplateCard } from "~/features/templates/components/create-template-card";
import { TemplateCard } from "~/features/templates/components/template-card";
import { TemplatesEmptyState } from "~/features/templates/components/templates-empty-state";
import { TemplatesPagination } from "~/features/templates/components/templates-pagination";
import { deleteTemplateAction } from "~/features/templates/server/actions/delete-template.action";
import { duplicateTemplateAction } from "~/features/templates/server/actions/duplicate-template.action";
import { getTemplateList, getTemplateLimits } from "~/features/templates/server/services/templates.service";
import { createLogger } from "~/lib/logger";

export const metadata: Metadata = {
  title: "Moje Szablony"
};

const logger = createLogger({ module: "templates-page" });

function parseSearchParams(raw: Record<string, string | string[] | undefined>) {
  const search = typeof raw.search === "string" ? raw.search.trim() : "";
  const pageRaw = typeof raw.page === "string" ? Number.parseInt(raw.page, 10) : 1;
  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? pageRaw : 1;
  return { search, page };
}

async function loadData(searchParams: PageProps<"/app/templates">["searchParams"]) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  const params = await searchParams;
  const { search, page } = parseSearchParams(params);

  const [listError, listResult] = await getTemplateList(userId, { search, page, perPage: 12 });
  if (listError) {
    logger.error({ userId, errorCode: listError.code }, "Failed to load template list");
    throw listError;
  }

  const [limitsError, limits] = await getTemplateLimits(userId);
  if (limitsError) {
    logger.error({ userId, errorCode: limitsError.code }, "Failed to load template limits");
    throw limitsError;
  }

  logger.info({ userId }, "Successfully loaded templates page data");
  return { search, listResult, limits };
}

export default async function TemplatesPage({ searchParams }: PageProps<"/app/templates">) {
  const { search, listResult, limits } = await loadData(searchParams);

  const { items } = listResult;
  const isAtLimit = limits.max !== null && limits.used >= limits.max;

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
                <BreadcrumbPage>Moje Szablony</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-heading-h1">Moje Szablony</h1>
          <p className="text-lead text-muted-foreground">
            Zarządzaj powtarzalnymi procesami swoich projektów rzemieślniczych
          </p>
        </div>

        <div className="flex shrink-0 sm:gap-3">
          <div className="space-y-2">
            <Badge variant="outline" className="hidden sm:flex">
              <span className="text-muted-foreground font-bold uppercase">Wykorzystanie:</span>{" "}
              <span className="text-primary">
                {limits.used} z {limits.max} szablonów
              </span>
            </Badge>
            <Progress value={limits.max !== null ? (limits.used / limits.max) * 100 : 0} />
          </div>

          <CreateTemplateButton limits={limits} />
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <SearchInput defaultValue={search} placeholder="Szukaj szablonu..." />
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <TemplatesEmptyState />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <TemplateCard
                key={item.id}
                item={item}
                isLastTemplate={items.length === 1}
                onDeleteAction={deleteTemplateAction}
                onDuplicateAction={duplicateTemplateAction}
              />
            ))}

            {!isAtLimit ? <CreateTemplateCard /> : null}
          </div>

          <TemplatesPagination pagination={listResult.pagination} />
        </div>
      )}
    </div>
  );
}

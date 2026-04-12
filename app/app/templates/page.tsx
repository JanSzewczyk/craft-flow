import { type Metadata } from "next";

import { auth } from "@clerk/nextjs/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@szum-tech/design-system";
import Link from "next/link";
import { redirect } from "next/navigation";

import { TemplatesSection } from "~/features/templates/components/templates-section";
import { getTemplateList, getTemplateLimits } from "~/features/templates/server/services/templates-list.service";
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

  return (
    <TemplatesSection
      items={listResult.items}
      limits={limits}
      pagination={listResult.pagination}
      defaultSearch={search}
    />
  );
}

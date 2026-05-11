import * as React from "react";

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
import { notFound, redirect } from "next/navigation";
import { ContractorDetailsContent } from "~/features/crm/components";
import { getClientContractor } from "~/features/projects/server/services/projects.service";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "client-contractor-page" });

async function loadData({ contractorId }: { contractorId: string }) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  const [err, contractor] = await getClientContractor({ userId, contractorId });
  if (err) {
    logger.error({ userId, contractorId, errorCode: err.code }, "Failed to load contractor detail");
    notFound();
  }

  logger.info({ userId, contractorId }, "Successfully loaded contractor page data");
  return { contractor };
}

export async function generateMetadata({ params }: PageProps<"/client/contractors/[contractorId]">): Promise<Metadata> {
  const { contractorId } = await params;
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated || !userId) return { title: "Wykonawca" };

  const [, contractor] = await getClientContractor({ userId, contractorId });
  return { title: contractor?.companyName ?? "Wykonawca" };
}

export default async function ClientContractorPage({ params }: PageProps<"/client/contractors/[contractorId]">) {
  const { contractorId } = await params;
  const { contractor } = await loadData({ contractorId });

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
              <BreadcrumbLink asChild>
                <Link href="/client/contractors">Wykonawcy</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{contractor.companyName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-heading-h1">{contractor.companyName}</h1>
      </div>

      <div className="max-w-2xl">
        <ContractorDetailsContent contractor={contractor} />
      </div>
    </div>
  );
}

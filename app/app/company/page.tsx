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
import { getCompanyProfile } from "~/features/contractor/server/services/company-profile.service";
import { createLogger } from "~/lib/logger";
import { PencilIcon } from "lucide-react";
import { CompanyProfileCards } from "~/features/contractor/components";

export const metadata: Metadata = {
  title: "Dane firmy"
};

const logger = createLogger({ module: "company-page" });

async function loadData() {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.error("User not authenticated");
    redirect("/sign-in");
  }

  const [error, data] = await getCompanyProfile(userId);
  if (error) {
    logger.error({ userId, errorCode: error.code }, "Failed to load company profile");
    throw error;
  }

  logger.info({ userId }, "Successfully loaded company page data");
  return { data };
}

export default async function CompanyPage() {
  const { data } = await loadData();

  return (
    <div className="space-y-6">
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/app/dashboard">Craft Flow</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dane firmy</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
        <div>
          <h1 className="text-heading-h1">Profil Firmy</h1>
          <p className="text-lead">Podstawowe informacje o Twojej firmie</p>
        </div>
        <Button asChild variant="outline" startIcon={<PencilIcon />}>
          <Link href="/app/company/edit">Edytuj</Link>
        </Button>
      </div>
      <CompanyProfileCards data={data} />
    </div>
  );
}

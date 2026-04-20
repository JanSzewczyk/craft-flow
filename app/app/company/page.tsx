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
import { CompanyProfileForm } from "~/features/contractor/components";
import { updateCompanyProfileAction } from "~/features/contractor/server/actions/company/update-company-profile.action";
import { getCompanyProfileData } from "~/features/contractor/server/services/company-profile.service";
import { createLogger } from "~/lib/logger";

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

  const [error, data] = await getCompanyProfileData(userId);
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
              <BreadcrumbPage>Dane firmy</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-heading-h1">Dane firmy</h1>
        <p className="text-lead">Zarządzaj podstawowymi informacjami o swojej firmie</p>
      </div>

      <CompanyProfileForm
        defaultValues={{
          companyName: data.companyName,
          industry: data.industry,
          phone: data.phone
        }}
        onSaveAction={updateCompanyProfileAction}
      />
    </div>
  );
}
